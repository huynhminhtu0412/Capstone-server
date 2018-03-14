var log4js = require('log4js');
var logger = log4js.getLogger('role_service');

var constants = require("../lib/constants");
var utils = require("../lib/utils");
var models = require('../models');

exports.GetRoles = function (callback) {
    models.Role.findAndCountAll(
        {
            attributes: ['id', 'name'],
        }
    ).then(function (roles) {
        var data = {
            "total_roles": roles.count,
            "roles": roles.rows
        };
        return callback(null, utils.ResultSuccess(data));
    }).catch(function (error) {
        logger.error(error.message);
        return callback(error.message, null);
    });
}

exports.GetPermissionRoles = function (role_id, callback) {
    models.PermissionRole.findAndCountAll(
        {
            attributes: ['permission_id'],
            where: {
                role_id: role_id
            }
        }
    ).then(function (permission_roles) {
        var data = {
            "total_permission_roles": permission_roles.count,
            "permission_roles": permission_roles.rows
        };
        return callback(null, utils.ResultSuccess(data));
    }).catch(function (error) {
        logger.error(error.message);
        return callback(error.message, null);
    });
}

exports.CreateRole = function (role, callback) {
    models.Role.create(role)
        .then(function (created_role) {
            return callback(null, utils.ResultSuccess(created_role));
        }).catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.UpdatRole = function (role_id, permission_ids, callback) {
    var permission_roles = [];

    for (permission_id of permission_ids) {
        var permission_role = {};
        permission_role.permission_id = permission_id;
        permission_role.role_id = role_id;
    
        permission_roles.push(permission_role);
    }

    models.PermissionRole.destroy({
        where: {
            role_id: role_id
        }
    })
        .then(function () {
            models.PermissionRole.bulkCreate(permission_roles);

            return callback(null, utils.ResultSuccess());
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}