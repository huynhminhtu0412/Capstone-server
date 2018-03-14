var log4js = require('log4js');
var logger = log4js.getLogger('classroom_service');
var constants = require("../lib/constants");
var utils = require("../lib/utils");
var models = require('../models');

exports.CreateExercise = function (exercise, callback) {
    models.Exercise.create(exercise)
        .then(function (result) {
            return callback(null, utils.ResultSuccess(result));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.GetExercises = function (course_id, callback) {
    models.Exercise.findAndCountAll({
        where: {
            course_id: course_id
        },
        order: [['updated_at', 'DESC']]
    })
        .then(function (exercises) {
            return callback(null, utils.ResultSuccess({
                "total_items": exercises.count,
                "exercises": exercises.rows
            }));
        })
        .catch(function (error) {
            logger.error(error.message);
            return callback(error.message, null);
        });
}

exports.SubmitExercise = function (submission, callback) {
    if (submission.file) {
        var buff = new Buffer(file.value, 'base64');
        var file_path = constants.WEB_HOST_NAME + '/exercise/' + file.filename;
        fs.writeFileSync("./public/exercise/" + file.filename, buff);
    }

    models.Submission.create({
        link_file: file_path,
        exercise_id: submission.exercise_id
    }).then(function (result) {
        return callback(null, utils.ResultSuccess(result));
    }).catch(function (error) {
        logger.error(error.message);
        return callback(error.message, null);
    });
}