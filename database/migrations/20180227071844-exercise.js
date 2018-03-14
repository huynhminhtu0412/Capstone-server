'use strict';

module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable('exercises', {
      id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
      name: DataTypes.STRING,
      question: DataTypes.STRING,
      answer: DataTypes.STRING,
      lecture_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'lectures', key: 'id', onDelete: 'cascade' } },
      course_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'courses', key: 'id', onDelete: 'cascade' } },
      deadline: DataTypes.DATE,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    }).then(function () {
      migration.createTable('submissions', {
        id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
        link_file: DataTypes.STRING,
        exercise_id: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
      }).then(function () {
        return done();
      });
    });
  },

  down: function (migration, DataTypes, done) {
    migration.dropTable('exercises').then(function () {
      migration.dropTable('submissions').then(function () {
        return done();
      });
    });
  }
};