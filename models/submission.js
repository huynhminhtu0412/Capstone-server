'use strict';
module.exports = function (sequelize, DataTypes) {
    var Submission = sequelize.define('Submission',
        {
            link_file: DataTypes.STRING,
            exercise_id: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
        },
        {
            classMethods: {
                associate: function (models) {
                    Submission.belongsTo(models.Exercise, {foreignKey: 'exercise_id'});
                }
            },
            underscored: true,
            tableName: "submissions"
        });
    return Submission;
}; 