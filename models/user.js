'use strict';
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      description: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      role_id: DataTypes.INTEGER,      
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    },
    {
      classMethods: {
        associate: function (models) {
            User.belongsToMany(models.Course, { through: 'user_courses', foreignKey: 'user_id' });    
            User.hasMany(models.UserCourse, { foreignKey: 'user_id', as: 'courses' });            
            User.hasOne(models.Role, { foreignKey: 'role_id', as: 'roles' });
            
            User.belongsToMany(models.Lecture, {through: 'user_lectures', foreignKey: 'user_id'});
            User.hasMany(models.UserLecture, { foreignKey: 'user_id', as: 'lectures' });            

        }
      },
      underscored: true,
      tableName: "users"
    });
  return User;
};