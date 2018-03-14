'use strict';
module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define('Role',
    {
      name: DataTypes.STRING,
      role_type: DataTypes.INTEGER, //0: student; 1: teacher; 2: section_academic, 3: admin
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    },
    {
      classMethods: {
        associate: function (models) {
          Role.hasMany(models.User);
        }
      },
      underscored: true,
      tableName: "roles"
    });
  return Role;
};  