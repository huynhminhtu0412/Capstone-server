var express = require('express');
var utils = require("../lib/utils");
var courseServices = require('../services/course_services');
var exerciseServices = require('../services/exercise_services');

var router = express.Router();
var auth_utils = require("../lib/auth_utils");


/**
 * @api {get} /courses/ Get All Courses
 * @apiDescription Get all user courses from database and return list of courses based pagenation setting.
 * @apiVersion 1.0.0
 * @apiName getCourses
 * @apiPermission admin_account
 * @apiGroup Role
 *
 * @apiParam {String} token User token string to authorize.
 * @apiParam {Number} [current_page = 1] Current page value.
 * @apiParam {Number} [page_size = 20] Number of courses per page value.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 * @apiSuccess {Object} data Courses list with pagenation info.
 * @apiSuccess {Number} data.total_items Total courses.
 * @apiSuccess {Object[]} data.courses List of courses in requested page (array of object).
 * @apiSuccess {Number} data.courses.id Role id.
 * @apiSuccess {String} data.courses.name Role name.
 * @apiSuccess {Number} data.courses.total_members Total members that assigned to role.
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "data": {
 *          "total_items": 10,
 *          "courses": [{
 *              "id": 1,
 *              "name": "English for children",
 *              "total_members": 4
 *            }]
 *       }
 *     }
 * @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "You are not authorized to access this page!",
 *     }
 */
router.get('/', auth_utils.AuthorizeAS, function (req, res) {
  var currentPage = req.query.current_page;
  var pageSize = req.query.page_size;
  courseServices.GetCourses(currentPage, pageSize, function (error, courses) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, courses);
    }
  });
});

router.get('/:id', auth_utils.AuthorizeStudentTeacherAS, function (req, res) {
  var courseId = req.params.id;
  courseServices.GetCourse(courseId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

/**
 * @api {post} /courses Create New Course
 * @apiDescription Create a new course.
 * @apiVersion 1.0.0
 * @apiName CreateCourse
 * @apiPermission hr_account
 * @apiGroup Course
 *
 * @apiParam {String} name Course name.
 * @apiParam {String} description Course description.
 * @apiParam {Number} duration Course duration.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 * @apiSuccess {Object} data Created section data.
 * @apiSuccess {String} data.section.name Course name.
 * @apiSuccess {String} data.section.description Course description.
 * @apiSuccess {String} data.section.duration Course duration.

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

router.post('/', auth_utils.AuthorizeAS, function (req, res) {
  var courseName = req.body.name;
  var courseDescription = req.body.description;
  var courseDuration = req.body.duration;
  var courseRequirement = req.body.requirement;
  var courseImage = req.body.image;
  var lectureDuration = req.body.lectureDuration;
  var lectures = req.body.lectures;

  courseServices.CreateCourse(courseName, courseDescription, courseRequirement, courseDuration, courseImage, lectureDuration, lectures, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});


/**
 * @api {delete} /courses/:id Delete Course
 * @apiDescription Teaching and study managing department delete a course
 * @apiVersion 1.0.0
 * @apiName DeleteCourse
 * @apiPermission tsmd_account
 * @apiGroup Course
 *
 * @apiParam {String} token User token string to authorize.
 * @apiParam {Number} id Section id.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 * @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "Cannot delete this course",
 *     }
 */
router.delete('/:id', auth_utils.AuthorizeAS, function (req, res) {
  var courseId = req.params.id;
  courseServices.DeleteCourse(courseId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

/**
 * @api {put} /courses/:id Update Course
 * @apiDescription Update information of courses.
 * @apiVersion 1.0.0
 * @apiName UpdateSection
 * @apiPermission hr_account
 * @apiGroup Course
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 *
 * @apiParam {String} token User token string to authorize.
 * @apiParam {Number} id Section id.
 * @apiParam {String} title Course title.
 * @apiParam {String} description Course description.
 * @apiParam {Number} duration Course duration.
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *     }
 ** @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "You are not authorized to access this page!",
 *     }
 */
router.put('/:id', auth_utils.AuthorizeAS, function (req, res) {
  var courseId = req.body.id;
  var courseName = req.body.name;
  var courseRequirement = req.body.requirement;
  var courseDescription = req.body.description;
  var courseDuration = req.body.duration;
  var image = req.body.image;

  courseServices.UpdateCourse(courseId, courseName, courseDescription, courseDuration, image, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

/**
 * @api {get} /roles/members Get Role Members
 * @apiDescription Get all members of a role.
 * @apiVersion 1.0.0
 * @apiName GetRoleMembers
 * @apiPermission admin_account
 * @apiGroup Role
 *
 * @apiParam {String} token User token string to authorize.
 * @apiParam {Number} role_id Role Id.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 * @apiSuccess {Object} data Users list with pagenation info.
 * @apiSuccess {Number} data.total_items Total members of role.
 * @apiSuccess {Object[]} data.members List of user accounts of requested page (array of object).
 * @apiSuccess {Number} data.members.id User id.
 * @apiSuccess {String} data.members.account User account name (login name).
 * @apiSuccess {String} data.members.fullname User fullname.
 * @apiSuccess {String} data.members.status Status of user (active / deactive).
 * @apiSuccess {Datetime} data.members.last_login Timestamps of last login of user. If user did not login to the system, then this value is <code>null</code>.
 * @apiSuccess {Datetime} data.members.last_updated Timestamps of last synced from .
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *       "data": {
 *          "total_items": 20,
 *          "users": [{
 *              "id": 5,
 *              "account": "mickeym",
 *              "fullname": "Micky Mouse",
 *              "status": "active",
 *              "last_login": "2016 Jun 13 12:12:00",
 *              "last_updated": "2016 Jun 15 12:12:00"
 *          }]
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
router.get('/:courseId/users', auth_utils.AuthorizeAS, function (req, res, next) {
  var courseId = req.params.courseId;
  courseServices.GetCourseUsers(courseId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

/**
 * @api {post} /roles/:id/assign-users Assign Members To Role
 * @apiDescription Assign / Unassign multiple users to a role.
 * @apiVersion 1.0.0
 * @apiName AssignMembersToRole
 * @apiPermission admin_account
 * @apiGroup User
 *
 * @apiParam {Number} id User Id that needs to assign to roles.
 * @apiParam {String} token User token string to authorize.
 * @apiParam {Number[]} role_ids List of role Ids.
 *
 * @apiSuccess {Boolean} success TRUE if succeed / FALSE if failed.
 *
 * @apiSuccessExample Success Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true
 *     }
 * @apiSuccessExample Failed Response
 *     HTTP/1.1 200 OK
 *     {
 *       "success": false,
 *       "message": "This user is already in those roles!",
 *       "code": "ROLE_01"
 *     }
 */


router.post('/:id/assign-users', auth_utils.AuthorizeAS, function (req, res, next) {
  var userIds = req.body.userIds;
  var courseId = req.params.id;
  courseServices.AddUsersOfCourse(courseId, userIds, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    } else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.delete('/unassign-user/:id', auth_utils.AuthorizeAS, function (req, res, next) {
  var userCourseId = req.params.id;
  courseServices.RemoveUsersOfCourse(userCourseId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    } else {
      utils.ResponseWithToken(req, res, result);
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
router.post('/search', auth_utils.AuthorizeAS, function (req, res) {
  var searchString = req.body.search_string;
  var currentPage = req.body.current_page;
  var pageSize = req.body.page_size;
  courseServices.SearchCourses(searchString, currentPage, pageSize, function (error, users) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, users);
    }
  });
});

router.get('/:courseId/get-lectures', auth_utils.AuthorizeStudentAndTeacher, function (req, res, next) {
  var courseId = req.params.courseId;
  courseServices.GetLectures(courseId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.get('/:courseId/get-exercises', auth_utils.AuthorizeStudentAndTeacher, function (req, res, next) {
  var courseId = req.params.courseId;
  exerciseServices.GetExercises(courseId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.post('/create-exercise', auth_utils.AuthorizeTeacher, function (req, res) {
  var exercise = req.body.exercise;

  exerciseServices.CreateExercise(exercise, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.post('/submit', auth_utils.AuthorizeStudent, function (req, res) {
  var submission = req.body.submission;

  exerciseServices.SubmitExercise(submission, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.get('/:courseId/coursedetail', auth_utils.AuthorizeStudentAndTeacher, function (req, res, next) {
  var courseId = req.params.courseId;
  courseServices.GetTeacherCourse(courseId, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

module.exports = router;