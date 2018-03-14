'use strict';
module.exports = function (sequelize, DataTypes) {
    var PermissionRole = sequelize.define('PermissionRole',
        {
            permission_id: DataTypes.INTEGER,
            role_id: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    PermissionRole.belongsTo(models.Permission, { foreignKey: 'permission_id' });
                    PermissionRole.belongsTo(models.Role, { foreignKey: 'role_id' });
                }
            },
            underscored: true,
            tableName: "permission_roles"
        });
    return PermissionRole;
};