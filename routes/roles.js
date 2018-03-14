var express = require('express');
var utils = require("../lib/utils");
var roleServices = require('../services/role_services');
var router = express.Router();
var auth_utils = require("../lib/auth_utils");

router.get('/', function (req, res) {
  roleServices.GetRoles(function (error, courses) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, courses);
    }
  });
});

router.get('/:id/permissions', function (req, res) {
  var role_id = req.params.id;

  roleServices.GetPermissionRoles(role_id, function (error, courses) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, courses);
    }
  });
});

router.post('/', function (req, res) {
  var role = req.body.role;

  roleServices.CreateRole(role, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

router.post('/:id/update-permissions', function (req, res) {
  var role_id = req.params.id;
  var permission_ids = req.body.permission_ids;

  roleServices.UpdatPermissionsRole(role_id, permission_ids, function (error, result) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, result);
    }
  });
});

module.exports = router;
