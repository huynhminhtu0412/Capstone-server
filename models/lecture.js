'use strict';
module.exports = function (sequelize, DataTypes) {
    var Lecture = sequelize.define('Lecture',
        {
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            duration: DataTypes.INTEGER,
            course_id: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    Lecture.belongsToMany(models.User, { through: 'user_lectures', foreignKey: 'lecture_id' });
                    Lecture.hasMany(models.Exercise, { foreignKey: 'lecture_id' });
                }
            },
            underscored: true,
            tableName: "lectures"
        });
    return Lecture;
}; 