'use strict';

module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable('user_lectures', {
      id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
      lecture_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'lectures', key: 'id', onDelete: 'cascade' } },
      user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id', onDelete: 'cascade' } },
      day: DataTypes.DATE,
      off: DataTypes.BOOLEAN,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    }).then(function () {
      return done();
    });
  },

  down: function (migration, DataTypes, done) {
    migration.dropTable('user_lectures').then(function () {
      return done();
    });
  }
};