'use strict';

module.exports = {

  up: function (migration, DataTypes, done) {
    migration.addColumn('courses', 'image', DataTypes.STRING).then(function () {
      return done();
    });
  },

  down: function (migration, DataTypes, done) {
    migration.removeColumn('courses', 'image').then(function () {
      return done();
    });
  }

};