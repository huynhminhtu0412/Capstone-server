'use strict';
module.exports = function (sequelize, DataTypes) {
    var Course = sequelize.define('Course',
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            requirement: DataTypes.STRING,
            duration: DataTypes.INTEGER,
            image: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    Course.belongsToMany(models.User, { through: 'user_courses', foreignKey: 'course_id' });
                    Course.hasMany(models.UserCourse);
                    Course.hasMany(models.Lecture);
                    Course.hasMany(models.Exercise);
                }
            },
            underscored: true,
            tableName: "courses"
        });
    return Course;

}; 