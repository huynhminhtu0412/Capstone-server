var log4js = require('log4js');
var logger = log4js.getLogger('classroom_service');
var constants = require("../lib/constants");
var utils = require("../lib/utils");
var models = require('../models');
var toPdf = require("office-to-pdf");
var fs = require("fs");
var uuid = require('node-uuid');


exports.officeToPdf = function (officeFile, callback) {
    let buff = new Buffer(officeFile.value, 'base64');
    toPdf(buff).then(
        (pdfBuffer) => {
            var uuid_filename = uuid.v4() + '.pdf';                 
            fs.writeFileSync("./public/tmpPdf/" + uuid_filename, pdfBuffer);
            data = {
                linkPdf: constants.WEB_HOST_NAME + '/tmpPdf/' + uuid_filename 
            }
            return callback(null, utils.ResultSuccess(data));
        }, (err) => {
            console.log(err);
        }
    )
}