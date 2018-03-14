var log4js = require('log4js');
var logger = log4js.getLogger('course_service');

var constants = require("../lib/constants");
var utils = require("../lib/utils");
var models = require('../models');
var fs = require("fs");
var uuid = require('node-uuid');

exports.GetCourses = function (currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, callback) {
	var offset = (currentPage - 1) * pageSize;

	models.Course.findAndCountAll(
		{
			attributes: ['id', 'name', 'description', 'image', 'updated_at'],
			limit: pageSize,
			offset: offset,
			order: [['updated_at', 'DESC']]
		}
	).then(function (courses) {
		var data = {
			"total_courses": courses.count,
			"courses": courses.rows
		};
		return callback(null, utils.ResultSuccess(data));
	}).catch(function (error) {
		logger.error(error.message);
		return callback(error.message, null);
	});
}

exports.GetCourse = function (courseId, callback) {
	models.Course.find(
		{
			where: {
				id: courseId
			}
		}
	).then(function (course) {
		return callback(null, utils.ResultSuccess(course));
	}).catch(function (error) {
		logger.error(error.message);
		return callback(error.message, null);
	});
}

exports.CreateCourse = function (courseName, description, requirement, duration, image, lecture_duration, lectures, callback) {
	if (image) {
		var image_type = image.filename.slice(-4);
		var buff = new Buffer(image.value, 'base64');
		var uuid_filename = uuid.v4() + image_type;
		var image_path = constants.WEB_HOST_NAME + '/course_image/' + uuid_filename;
		fs.writeFileSync("./public/course_image/" + uuid_filename, buff);
	}

	models.Course.create({
		name: courseName,
		description: description,
		requirement: requirement,
		duration: duration,
		image: image_path
	}).then(function (course) {
		if (lectures.length > 0) {
			var data = new Array();
			for (var i in lectures) {
				data.push({ name: lectures[i].lecture_name, description: lectures[i].lecture_description, duration: lecture_duration, course_id: course.id });
			}

			models.Lecture.bulkCreate(data);
		}
		return callback(null, utils.ResultSuccess(course));
	}).catch(function (error) {
		logger.error(error.message);
		return callback(error.message, null);
	});
}

exports.UpdateCourse = function (courseID, courseName, description, duration, image, callback) {
	if (image) {
		var image_type = image.filename.slice(-4);
		var buff = new Buffer(image.value, 'base64');
		var uuid_filename = uuid.v4() + image_type;
		var image_path = constants.WEB_HOST_NAME + '/course_image/' + uuid_filename;
		fs.writeFileSync("./public/course_image/" + uuid_filename, buff);
	}

	models.Course.find({
		where: {
			id: courseID
		}
	})
		.then(function (course) {
			console.log(course);
			if (course) {
				course.updateAttributes({
					name: courseName,
					description: description,
					requirement: 'requirement',
					duration: duration,
					image: image_path
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

exports.DeleteCourse = function (courseID, callback) {
	models.UserCourse.destroy({
		where: {
			course_id: courseID
		}
	})
		.then(function () {
			models.Course.destroy({
				where: {
					id: courseID
				}
			})

			return callback(null, utils.ResultSuccess());
		})
		.catch(function (error) {
			logger.error(error.message);
			return callback(error.message, null);
		});
}

exports.GetCourseUsers = function (courseID, callback) {
	models.User.findAndCountAll({
		attributes: ['id', 'username', 'full_name'],
		include: [{ model: models.UserCourse, as: 'courses', attributes: ['course_id'], where: { course_id: courseID } }],
	}).then(function (users) {
		console.log(users);
		var data = {
			"total_items": users.count,
			"users": users.rows
		};
		return callback(null, utils.ResultSuccess(data));
	}).catch(function (error) {
		console.log(error.message);
		return callback(error.message, null);
	})
}

exports.AssignUserToCourse = function (userIds, courseId, callback) {
	models.UserCourse.findAll({
		attributes: ['user_id'],
		where: { course_id: courseId },
		raw: true
	}).then(function (data) {
		var currentUserIds = data.map(function (obj) { return obj.user_id });
		var addUserIds = userIds.filter(id => currentUserIds.indexOf(id) < 0);
		var removeUserIds = currentUserIds.filter(id => userIds.indexOf(id) < 0);
		InsertAndRemoveUsers(courseId, removeUserIds, addUserIds, function (result) {
			if (result) {
				return callback(null, utils.ResultSuccess());
			}
			else {
				return callback(null, utils.ResultError(errors.ROLE_01, 'ROLE_01'));
			}
		});
	}).catch(function (error) {
		logger.error(error.message);
		return callback(error.message, null);
	})
}

exports.SearchCourses = function (searchString, currentPage = 1, pageSize = constants.DEFAULT_PAGE_SIZE, callback) {
	var offset = (currentPage - 1) * pageSize;
	searchString = utils.FormatSearchString(searchString);
	models.Course.findAndCountAll({
		where: {
			name: {
				$iLike: searchString
			}
		},
		limit: pageSize,
		offset: offset
	})
		.then(function (courses) {
			var data = {
				"total_courses": courses.count,
				"courses": courses.rows
			};
			return callback(null, utils.ResultSuccess(data));
		})
		.catch(function (error) {
			logger.error(error.message);
			return callback(error.message, null);
		});
}
//-------------Private function --------------//

exports.RemoveUsersOfCourse = function (userCourseId, callback) {
	models.UserCourse.destroy({
		where: {
			id: userCourseId
		}
	}).then(function () {
		return callback(null, utils.ResultSuccess());
	}).catch(function (error) {
		logger.error(error.message);
		return callback(error.message, null);
	});
}

exports.AddUsersOfCourse = function (courseID, addUserIds, callback) {
	if (addUserIds.length <= 0) {
		return callback(true);
	}

	var data = new Array();
	for (var i in addUserIds) {
		data.push({ user_id: addUserIds[i], course_id: courseID });
	}

	models.UserCourse.bulkCreate(data)
		.then(function () {
			return callback(null, utils.ResultSuccess());
		}).catch(function (error) {
			logger.error(error.message);
			return callback(error.message, null);
		});
}
exports.GetLectures = function (course_id, callback) {

	models.Lecture.findAndCountAll(
		{

			attributes: ['id', 'name', 'description'],
			where: {
				course_id: course_id
			}
		}
	).then(function (lectures) {
		console.log(456);
		var data = {
			"total_lectures": lectures.count,
			"lectures": lectures.rows
		};
		console.log(data.total_lectures);
		console.log(data.lectures);
		return callback(null, utils.ResultSuccess(data));
	}).catch(function (error) {
		logger.error(error.message);
		return callback(error.message, null);
	});
}



exports.GetTeacherCourse = function (courseID, callback) {
	models.User.findAndCountAll({
		attributes: ['id', 'username', 'description'],
		where : { role_id : 1},
		include: [{ model: models.UserCourse, as: 'courses', attributes: ['course_id'], 
		where: { course_id: courseID} }],
	}).then(function (teacherCourse) {
		
		var data = {
			"total_teachers": teacherCourse.count,
			"teachers": teacherCourse.rows
		};
		return callback(null, utils.ResultSuccess(data));
	}).catch(function (error) {
		console.log(error.message);
		return callback(error.message, null);
	})
}