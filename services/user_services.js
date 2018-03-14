var log4js = require('log4js');
var logger = log4js.getLogger('user_service');
var constants = require("../lib/constants");
var utils = require("../lib/utils");
var auth_utils = require("../lib/auth_utils");
var models = require('../models');
var md5 = require('md5');
var Sequelize = require('sequelize');
var validator = require('validator');

if (typeof require !== 'undefined') XLSX = require('xlsx');

exports.LoginUser = function (username, password, callback) {
    models.User.findOne({
        where: {
            username: username,
            password: md5(password)
        }
    })
        .then(function (user) {
            if (user == null) {
                return callback(null, utils.ResultError(errors.AUTHENTICATE_02, 'AUTHENTICATE_02'));
            }

            var userData = {
                id: user.id,
                full_name: user.full_name,
                role_id: user.role_id,
                token: auth_utils.GetToken({
                    user_id: user.id,
                    role: user.role_id
                }),
                email: user.email
            }
            return callback(null, utils.ResultSuccess(userData));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        })
}

exports.CreateUser = function (username, full_name, password, email, role_id, callback) {
    var password_encoded = md5(password);

    models.User.create({
        username: username,
        full_name: full_name,
        password: password_encoded,
        email: email,
        role_id: role_id
    })
        .then(function (user) {
            return callback(null, utils.ResultSuccess(user));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.UpdateUserInfo = function (userID, username, password, full_name, age, description, email, phone, callback) {
    models.User.find({
        where: {
            id: userID
        }
    })
        .then(function (user) {
            if (user) {
                user.updateAttributes({
                    username: username,
                    password: password,
                    full_name: full_name,
                    age: age,
                    description: description,
                    email: email,
                    phone: phone
                })
                    .then(function (data) {
                        return callback(null, utils.ResultSuccess(data));
                    })
                    .catch(function (error) {
                        logger.error(error.message);
                        return callback(error.message, null);
                    });
            }
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.DeleteUser = function (userId, callback) {
    models.UserCourse.destroy({
        where: {
            user_id: userId
        }
    })
        .then(function () {
            models.User.destroy({
                where: {
                    id: userId
                }
            })

            return callback(null, utils.ResultSuccess());
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.GetUsers = function (currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, callback) {
    var offset = (currentPage - 1) * pageSize;
    models.User.findAndCountAll({
        attributes: ['id', 'username', 'full_name', 'role_id', 'email'],
        limit: pageSize,
        offset: offset,
        order: 'username'
    })
        .then(function (users) {
            return callback(null, utils.ResultSuccess({
                "total_items": users.count,
                "users": users.rows
            }));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.GetUserAssigned = function (currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, role_id, course_id, callback) {
    var offset = (currentPage - 1) * pageSize;
    models.UserCourse.findAndCountAll({
        attributes: ['id'],
        where: {
            course_id: course_id
        },
        include: [{
            model: models.User,
            attributes: ['id', 'username', 'full_name', 'role_id', 'email'],
            where: { role_id: role_id }
        }],
        limit: pageSize,
        offset: offset,
        order: 'username'
    })
        .then(function (users) {
            return callback(null, utils.ResultSuccess({
                "total_items": users.count,
                "users": users.rows
            }));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}


exports.GetUsersNotAssigned = function (currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, role_id, course_id, callback) {
    var offset = (currentPage - 1) * pageSize;

    models.sequelize.query("SELECT id, username, full_name, role_id, email FROM users WHERE role_id = ? AND id NOT IN (SELECT user_id FROM user_courses WHERE course_id = ?) LIMIT ? OFFSET ?"
        , { replacements: [role_id, course_id, pageSize, offset], type: models.sequelize.QueryTypes.SELECT }
    ).then(users => {
        models.sequelize.query("SELECT COUNT(id) FROM users WHERE role_id = ? AND id NOT IN (SELECT user_id FROM user_courses WHERE course_id = ?)"
            , { replacements: [role_id, course_id], type: models.sequelize.QueryTypes.SELECT }
        ).then(count => {
            return callback(null, utils.ResultSuccess({
                "total_items": parseInt(count[0].count),
                "users": users
            })
            );
        }).catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
    })
}


exports.SearchUserCourseAssgined = function (courseId, searchString, role_id, currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, callback) {
    var offset = (currentPage - 1) * pageSize;
    searchString = utils.FormatSearchString(searchString);
    models.UserCourse.findAndCountAll({
        attributes: ['id'],
        where: {
            course_id: courseId,
        },
        include: [{
            model: models.User,
            where: {
                $or: [
                    {
                        username: {
                            $iLike: searchString
                        }
                    },
                    {
                        full_name: {
                            $iLike: searchString
                        }
                    }
                ],
                role_id: role_id
            }
        }],
        limit: pageSize,
        offset: offset
    })
        .then(function (users) {
            var data = {
                "total_users": users.count,
                "users": users.rows
            };
            return callback(null, utils.ResultSuccess(data));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.SearchUserCourseNotAssgined = function (courseId, searchString, role_id, currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, callback) {
    var offset = (currentPage - 1) * pageSize;
    searchString = utils.FormatSearchString(searchString);

    models.sequelize.query("SELECT id, username, full_name, role_id, email FROM users WHERE role_id = ? AND (username LIKE ? OR full_name LIKE ?) AND id NOT IN (SELECT user_id FROM user_courses WHERE course_id = ?) LIMIT ? OFFSET ?"
        , { replacements: [role_id, searchString, searchString, courseId, pageSize, offset], type: models.sequelize.QueryTypes.SELECT }
    ).then(users => {
        models.sequelize.query("SELECT COUNT(id) FROM users WHERE role_id = ? AND (username LIKE ? OR full_name LIKE ?) AND id NOT IN (SELECT user_id FROM user_courses WHERE course_id = ?)"
            , { replacements: [role_id, searchString, searchString, courseId], type: models.sequelize.QueryTypes.SELECT }
        ).then(count => {
            return callback(null, utils.ResultSuccess({
                "total_items": parseInt(count[0].count),
                "users": users
            })
            );
        }).catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
    })
}

exports.GetDaysOff = function (user_id, currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, callback) {
    var offset = (currentPage - 1) * pageSize;

    models.UserLecture.findAndCountAll(
        {
            attributes: ['day'],
            where: {
                user_id: user_id,
                off: true
            },
            include: [{
                model: models.User,
                attributes: ['username']
            },
            {
                model: models.Lecture,
                attributes: ['name']
            }],
            limit: pageSize,
            offset: offset
        }
    ).then(function (daysOff) {
        var data = {
            "total_daysOff": daysOff.count,
            "daysOff": daysOff.rows
        };
        return callback(null, utils.ResultSuccess(data));
    }).catch(function (error) {
        logger.error(error.message);
        return callback(error.message, null);
    });
}


exports.GetCourseUser = function (userID, currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, callback) {
    var offset = (currentPage - 1) * pageSize;
    models.UserCourse.findAndCountAll({
        attributes: [],
        where: {
            user_id: userID,
        },
        include: [{
            model: models.Course,
            attributes: ['id', 'image', 'name', 'description']
        }],
        limit: pageSize,
        offset: offset
    })
        .then(function (userCourse) {
            var userData = {
                "total_course": userCourse.count,
                "courses": userCourse.rows
            };

            return callback(null, utils.ResultSuccess(userData));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        })
}

exports.ImportUsers = function (excelFile, callback) {
    let file = new Buffer(excelFile.value, 'base64');
    var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    var workbook = XLSX.read(file);
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var data = XLSX.utils.sheet_to_json(worksheet);
    var data = changeFormatHeader(data);
    if (typeof data === 'string') {
        logger.error(data);
        return callback(data, null);
    } else {
        models.User.bulkCreate(data)
            .then(function () {
                return callback(null, utils.ResultSuccess());
            }).catch(function (error) {
                logger.error(error.message);
            });
    }
}

function changeFormatHeader(data) {
    var users = [];
    var errorMessage;

    for (raw_object of data) {
        var user = {};
        user.username = raw_object['Username'];
        user.full_name = raw_object['Full name'];
        user.password = md5(raw_object['Password']);
        user.email = raw_object['Email'];
        user.age = raw_object['Age'];
        user.phone = raw_object['Phone'];
        user.description = raw_object['Description'];
        user.role_id = raw_object['Role'];

        errorMessage = validateUser(user);
        if (errorMessage != '')
            return errorMessage;
        users.push(user);
    }
    return users;
}

function validateUser(user) {
    var errorMessage = '';

    if (validator.isEmpty(user.username)) {
        return errorMessage = 'Username cannot be empty';
    }
    else {
        if (!validator.matches(user.username, /^[a-zA-Z0-9.\-_$@*!]/)) {
            return errorMessage = user.username + ' contains some special characters';
        } else {
            if (!validator.isLength(user.username, { min: 6, max: 20 })) {
                if (user.username.lenght < 6) {
                    return errorMessage = 'Username must have at least 6 characters';
                } else {
                    return errorMessage = 'Username must have at most 20 characters';
                }
            }
        }
    }

    if (validator.isEmpty(user.full_name)) {
        return errorMessage = 'Full name cannot be empty';
    }
    else {
        if (!validator.matches(user.full_name, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g)) {
            return errorMessage = user.full_name + ' contains some special characters';
        } else {
            if (!validator.isLength(user.full_name, { min: 3, max: 150 })) {
                if (user.full_name.lenght < 6) {
                    return errorMessage = 'Full name must have at least 3 characters';
                } else {
                    return errorMessage = 'Full name must have at most 150 characters';
                }
            }
        }
    }

    // if (validator.isEmpty(user.password)) {
    //     return errorMessage = 'Password cannot be empty';
    // }
    // else {
    //     if (!validator.matches(user.password, '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})')) {
    //         return errorMessage = 'Make sure that your password contains at least 1 lowercase letter, 1 uppercase letter, 1 numeric character and 1 special character.';
    //     } else {
    //         if (!validator.isLength(user.full_name, { min: 6, max: 50 })) {
    //             if (user.full_name.lenght < 6) {
    //                 return errorMessage = 'Password must have at least 6 characters';
    //             } else {
    //                 return errorMessage = 'Password must have at most 50 characters';
    //             }
    //         }
    //     }
    // }

    if (validator.isEmpty(user.email)) {
        return errorMessage = 'Email cannot be empty';
    }
    else {
        if (!validator.isEmail(user.email)) {
            return errorMessage = 'Wrong email format';
        }
    }

    if (!validator.isEmpty(user.age)) {
        if (!validator.isNumeric(user.age)) {
            return errorMessage = 'Age must be a number';
        }
    }

    if (!validator.isEmpty(user.phone)) {
        if (!validator.matches(user.phone, /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/)) {
            return errorMessage = 'Wrong phone number format';
        }
    }

    if (validator.isEmpty(user.role_id)) {
        return errorMessage = 'Role cannot be empty';
    }
    else {
        if (!validator.isNumeric(user.role_id)) {
            return errorMessage = role_id + 'Wrong role format';
        }
    }

    return errorMessage;
}