var express = require('express');
var utils = require("../lib/utils");
var classroomServices = require('../services/classroom_services');
var router = express.Router();
var auth_utils = require("../lib/auth_utils");

router.post('/convertPDF', function (req, res) {
  var officeFile = req.body.file;  
  classroomServices.officeToPdf(officeFile, function (error, courses) {
    if (error) {
      utils.ResponseWithToken(req, res, utils.ResultServiceError(error));
    }
    else {
      utils.ResponseWithToken(req, res, courses);
    }
  });
});

module.exports = router;
