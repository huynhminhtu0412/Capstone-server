'use strict';
module.exports = function (sequelize, DataTypes) {
  var UserCourse = sequelize.define('UserCourse',
    {
      course_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      number_of_students: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    },
    {
      classMethods: {
        associate: function (models) {
          UserCourse.belongsTo(models.Course, { foreignKey: 'course_id' });
          UserCourse.belongsTo(models.User, { foreignKey: 'user_id' });
        }
      },
      underscored: true,
      tableName: "user_courses"
    });
  return UserCourse;
};