var log4js = require('log4js');
var logger = log4js.getLogger('permission_service');

var constants = require("../lib/constants");
var utils = require("../lib/utils");
var models = require('../models');

exports.GetPermissions = function (callback) {
    models.Permission.findAndCountAll(
        {
            attributes: ['id', 'name'],
        }
    ).then(function (permissions) {
        var data = {
            "total_permissions": permissions.count,
            "permissions": permissions.rows
        };
        return callback(null, utils.ResultSuccess(data));
    }).catch(function (error) {
        logger.error(error.message);
        return callback(error.message, null);
    });
}
