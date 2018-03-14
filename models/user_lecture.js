'use strict';
module.exports = function (sequelize, DataTypes) {
  var UserLecture = sequelize.define('UserLecture',
    {
      user_id: DataTypes.INTEGER,
      lecture_id: DataTypes.INTEGER,
      day: DataTypes.DATE,
      off: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    },
    {
      classMethods: {
        associate: function (models) {
          UserLecture.belongsTo(models.Lecture, { foreignKey: 'lecture_id' });
          UserLecture.belongsTo(models.User, { foreignKey: 'user_id' });
        }
      },
      underscored: true,
      tableName: "user_lectures"
    });
  return UserLecture;
};