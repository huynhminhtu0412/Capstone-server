'use strict';
module.exports = function (sequelize, DataTypes) {
    var Exercise = sequelize.define('Exercise',
        {
            name: DataTypes.STRING,
            question: DataTypes.STRING,
            answer: DataTypes.STRING,
            lecture_id: DataTypes.INTEGER,
            course_id: DataTypes.INTEGER,
            deadline: DataTypes.DATE,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    Exercise.belongsTo(models.Lecture, {foreignKey: 'lecture_id'});
                    Exercise.belongsTo(models.Course, {foreignKey: 'course_id'});
                    Exercise.hasMany(models.Submission);
                }
            },
            underscored: true,
            tableName: "exercises"
        });
    return Exercise;
}; 