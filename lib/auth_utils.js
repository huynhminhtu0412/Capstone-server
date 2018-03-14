var constants = require("../lib/constants");
var errors = require("../lib/errors");
var utils = require("../lib/utils");
var jwt = require('jsonwebtoken');
var log4js = require('log4js');
var logger = log4js.getLogger("auth_utils");


exports.GetToken = GetToken

var ROLE = constants.ROLE;

exports.AuthorizeStudent = function (req, res, next) {
    AuthorizeRole([ROLE.STUDENT], req, function (result) {
        if (result.status != 200) res.status(result.status).send(result.data);
        else next();
    });
}

exports.AuthorizeStudentAndTeacher = function (req, res, next) {
    AuthorizeRole([ROLE.STUDENT, ROLE.TEACHER], req, function (result) {
        if (result.status != 200) res.status(result.status).send(result.data);
        else next();
    });
}

exports.AuthorizeStudentTeacherAS = function (req, res, next) {
    AuthorizeRole([ROLE.STUDENT, ROLE.TEACHER, ROLE.ACADEMY_SECTION], req, function (result) {
        if (result.status != 200) res.status(result.status).send(result.data);
        else next();
    });
}

exports.AuthorizeTeacher = function (req, res, next) {
    AuthorizeRole([ROLE.TEACHER], req, function (result) {
        if (result.status != 200) res.status(result.status).send(result.data);
        else next();
    });
}

exports.AuthorizeAS = function (req, res, next) {
    AuthorizeRole([ROLE.ACADEMY_SECTION], req, function (result) {
        if (result.status != 200) res.status(result.status).send(result.data);
        else next();
    });
}

exports.AuthorizeAdmin = function (req, res, next) {
    AuthorizeRole([ROLE.ADMIN], req, function (result) {
        if (result.status != 200) res.status(result.status).send(result.data);
        else next();
    });
}


function AuthorizeRole(role, req, callback) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // if there is no token --> return no token error    
    if (!token)
        return callback({
            "status": 403,
            "data": utils.ResultError(errors.AUTHORIZE_01, 'AUTHORIZE_01')
        });

    // decodes, verifies secret and checks exp
    jwt.verify(token, constants.SECRET, function (err, userData) {
        if (err)
            return callback({
                "status": 403,
                "data": utils.ResultError(errors.AUTHORIZE_02, 'AUTHORIZE_02')
            });


        // if user is not authorized --> no access permitted        
        if (!role.includes(userData.role))
            return callback({
                "status": 403,
                "data": utils.ResultError(errors.AUTHORIZE_04, 'AUTHORIZE_04')
            });

        // re-sign token if needed
        var createdDate = new Date(userData.iat * 1000);
        if ((Date.now() - createdDate) > (constants.AUTHENTICATE_RESIGN_TOKEN * 1000)) {
            var newUserData = {
                user_id: userData.user_id,
                role: userData.role_id
            };
            req.token = GetToken(newUserData);
            userData = newUserData;
        }

        // if everything is good, save to request for use in other routes
        req.current_user = userData;
        return callback({
            "status": 200,
            "data": userData
        });
    });
};

function GetToken(user) {
    logger.info("Sign token for user id: " + user.user_id);
    return jwt.sign(user, constants.SECRET, { expiresIn: constants.AUTHENTICATE_EXPIRE });
}