var express = require('express');
var router = express.Router();
var utils = require("../lib/utils");
var userService = require('../services/user_services');
var log4js = require('log4js');
var logger = log4js.getLogger("user_service");
var auth_utils = require("../lib/auth_utils");

/**
 * @api {post} /users/login Login User
 * @apiDescription Request authenticate a user with username and password
 * + Step 1: server verify username & password
 * + Step 2: query database to check if user is active. If no, return failed.
 * + Step 3: execute LDAP authenticate. If succeed, goto Step 4
 * + Step 4: Update last authenticate time and return data
 * @apiVersion 1.0.0
 * @apiName AuthenticateUser
 * @apiGroup User
 *
 * @apiParam {String} username Username to authenticate.
 * @apiParam {String} password Password of user.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 * @apiSuccess {Object} data User authentication information.
 * @apiSuccess {Number} data.id User id.
 * @apiSuccess {String} data.fullname User fullname.
 * @apiSuccess {String[]} data.roles List of roles that user belongs (array of integer). 1: Admin account; 2: HR account
 * @apiSuccess {String} data.token Authentication token string generated from server.
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *          "fullname": "Michael Sumakher",
 *          "roles": [2],
 *          "token": "abcdxfvz1234567--*324",
 *       }
 *     }
 * @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "Invalid username or password",
 *       "code": "AUTHENTICATE_01"
 *     }
 */
router.post('/login', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  userService.LoginUser(username, password, function (error, result) {
    if (error) {
      res.json(utils.ResultServiceError(error));
    }
    else {
      res.json(result);
    }
  });
});

/**
 * @api {post} /users/register Register
 * @apiDescription Create a new user.
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiPermission AS_account
 * @apiGroup User
 *
 * @apiParam {String} username User username.
 * @apiParam {String} full_name User full_name.
 * @apiParam {String} password User password.
 * @apiParam {String} email User email.
 * @apiParam {Number} role_id User role_id.

 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 * @apiSuccess {Object} data Created section data.
 * @apiSuccess {String} data.section.username User username.
 * @apiSuccess {String} data.section.full_name User full_name.
 * @apiSuccess {String} data.section.password User password.
 * @apiSuccess {Number} data.section.role_id User role_id.
 * @apiSuccess {Number} data.section.age User age.
 * @apiSuccess {String} data.section.description User description.
 * @apiSuccess {String} data.section.phone User phone.
 * @apiSuccess {Date} data.section.updated_at User updated_at.
 * @apiSuccess {Date} data.section.created_at User created_at.
 * 
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *          "section": {
 *              "id": 1,
 *              "name": "Technical Expertise"",
 *              "description": "",
 *              "duration": 60,
 *          }
 *       }
 *     }
 * @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "You are not authorized to access this page!",
 *     }
 */

router.post('/register', auth_utils.AuthorizeAS, function (req, res) {
  var username = req.body.username;
  var full_name = req.body.full_name;
  var password = req.body.password;
  var email = req.body.email;
  var role_id = req.body.role_id;


  userService.CreateUser(username, full_name, password, email, role_id, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.delete('/:id', auth_utils.AuthorizeAS, function (req, res) {
  var userId = req.params.id;
  userService.DeleteUser(userId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

/**
 * @api {get} /users/ Get All Users
 * @apiDescription Get all users from database and return list of users based pagenation setting.
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiPermission hr_account
 * @apiGroup User
 *
 * @apiParam {String} token User token string to authorize.
 * @apiParam {Number} [current_page = 1] Current page value.
 * @apiParam {Number} [page_size = 20] Number of users per page value.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 * @apiSuccess {Object} data Users list with pagenation info.
 * @apiSuccess {Number} data.total_items Total number of users.
 * @apiSuccess {Object[]} data.users List of user accounts of requested page (array of object).
 * @apiSuccess {Number} data.users.id User id.
 * @apiSuccess {String} data.users.account User account name (login name).
 * @apiSuccess {String} data.users.fullname User fullname.
 * @apiSuccess {String} data.users.status Status of user (active / deactive).
 * @apiSuccess {Datetime} data.users.last_login Timestamps of last login of user. If user did not login to the system, then this value is <code>null</code>.
 * @apiSuccess {Object[]} data.users.roles List of role ids that user belongs. If there is no roles, this user is in Employee role.
 * @apiSuccess {Number} data.users.roles.role_id Role id that user belongs to.
 * @apiSuccess {Datetime} data.users.last_updated Timestamps of last synced from .
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *          "total_items": 15,
 *          "users": [{
 *              "id": 5,
 *              "account": "mickeym",
 *              "fullname": "Micky Mouse",
 *              "status": "active",
 *              "last_login": "2016 Jun 13 12:12:00",
 *              "roles": [
 *                "role_id": 1,
 *                "role_id": 2,
 *              ],
 *              "last_updated": "2016 Jun 15 12:12:00"
 *            }]
 *       }
 *     }
 * @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "You are not authorized to access this page!",
 *       "code": "AUTHORIZE_01"
 *     }
 */
router.get('/', auth_utils.AuthorizeAS, function (req, res) {
  var currentPage = req.query.current_page;
  var pageSize = req.query.page_size;
  userService.GetUsers(currentPage, pageSize, function (error, users) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, users);
    }
  });
});

router.get('/getUsersAssigned', auth_utils.AuthorizeAS, function (req, res) {
  var currentPage = req.query.current_page;
  var pageSize = req.query.page_size;
  var roleId = req.query.role_id;
  var courseId = req.query.course_id;

  userService.GetUserAssigned(currentPage, pageSize, roleId, courseId, function (error, users) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, users);
    }
  });
});

router.get('/getUsersNotAssigned', auth_utils.AuthorizeAS, function (req, res) {
  var currentPage = req.query.current_page;
  var pageSize = req.query.page_size;
  var roleId = req.query.role_id;
  var courseId = req.query.course_id;

  userService.GetUsersNotAssigned(currentPage, pageSize, roleId, courseId, function (error, users) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, users);
    }
  });
});

/**
 * @api {post} /users/search Search Users
 * @apiDescription Search users via account and fullname and get list of users with pagenation setting.
 * @apiVersion 1.0.0
 * @apiName SearchUsers
 * @apiPermission hr_account
 * @apiGroup User
 *
 * @apiParam {String} token User token string to authorize.
 * @apiParam {String} search_string Search text (user account or fullname).
 * @apiParam {Number} [current_page = 1] Current page value.
 * @apiParam {Number} [page_size = 20] Number of users per page value.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 * @apiSuccess {Object} data Users list with pagenation info.
 * @apiSuccess {Number} data.total_items Total number of users.
 * @apiSuccess {Object[]} data.users List of user accounts of requested page (array of object).
 * @apiSuccess {Number} data.users.id User id.
 * @apiSuccess {String} data.users.account User account name (login name).
 * @apiSuccess {String} data.users.fullname User fullname.
 * @apiSuccess {String} data.users.status Status of user (active / deactive).
 * @apiSuccess {Datetime} data.users.last_login Timestamps of last login of user. If user did not login to the system, then this value is <code>null</code>.
 * @apiSuccess {Object[]} data.users.roles List of role ids that user belongs. If there is no roles, this user is in Employee role.
 * @apiSuccess {Number} data.users.roles.role_id Role id that user belongs to.
 * @apiSuccess {Datetime} data.users.last_updated Timestamps of last synced from .
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *          "total_items": 45,
 *          "users": [{
 *              "id": 5,
 *              "account": "mickeym",
 *              "fullname": "Micky Mouse",
 *              "status": "active",
 *              "last_login": "2016 Jun 13 12:12:00",
 *              "roles": [
 *                "role_id": 1,
 *                "role_id": 2,
 *              ],
 *              "last_updated": "2016 Jun 15 12:12:00"
 *            }]
 *       }
 *     }
 * @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "You are not authorized to access this page!",
 *       "code": "AUTHORIZE_01"
 *     }
 */

router.post('/searchUserCourseAssgined', auth_utils.AuthorizeAS, function (req, res) {
  var searchString = req.body.search_string;
  var courseId = req.body.course_id;
  var role_id = req.body.role_id;
  var currentPage = req.body.current_page;
  var pageSize = req.body.page_size;

  console.log(courseId);

  userService.SearchUserCourseAssgined(courseId, searchString, role_id, currentPage, pageSize, function (error, users) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, users);
    }
  });
});

router.post('/searchUserCourseNotAssgined', auth_utils.AuthorizeAS, function (req, res) {
  console.log(456);

  var searchString = req.body.search_string;
  var courseId = req.body.course_id;
  var role_id = req.body.role_id;
  var currentPage = req.body.current_page;
  var pageSize = req.body.page_size;
  console.log(courseId);

  userService.SearchUserCourseNotAssgined(courseId, searchString, role_id, currentPage, pageSize, function (error, users) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, users);
    }
  });
});

router.post('/getdaysoff', function (req, res) {
  var user_id = req.body.user_id;
  var currentPage = req.body.current_page;
  var pageSize = req.body.page_size;
  userService.GetDaysOff(user_id, currentPage, pageSize, function (error, users) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, users);
    }
  });
});

router.post('/mycourse', auth_utils.AuthorizeStudentAndTeacher, function (req, res) {
  var userID = req.body.user_id;
  var currentPage = req.body.current_page;
  var pageSize = req.body.page_size;

  userService.GetCourseUser(userID, currentPage, pageSize, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.post('/import', auth_utils.AuthorizeAS, function (req, res) {
  var excelFile = req.body.file;

  userService.ImportUsers(excelFile, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

module.exports = router;
