'use strict';
module.exports = function (sequelize, DataTypes) {
    var Permission = sequelize.define('Permission',
        {
            name: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    Permission.belongsToMany(models.Role, { through: 'permission_roles', foreignKey: 'permission_id' });
                }
            },
            underscored: true,
            tableName: "permissions"
        });
    return Permission;
}; 