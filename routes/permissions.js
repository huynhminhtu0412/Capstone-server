var express = require('express');
var utils = require("../lib/utils");
var permissionServices = require('../services/permission_services');
var router = express.Router();
var auth_utils = require("../lib/auth_utils");

router.get('/', function (req, res) {
    permissionServices.GetPermissions(function (error, courses) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, courses);
    }
  });
});

module.exports = router;
