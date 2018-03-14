'use strict';

module.exports = {
  up: function (migration, DataTypes, done) {

    migration.createTable('users', {
      id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      description: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE

    }).then(function () {
      migration.createTable('courses', {
        id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        requirement: DataTypes.STRING,
        duration: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE

      }).then(function () {
        migration.createTable('lectures', {
          id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
          name: DataTypes.STRING,
          description: DataTypes.STRING,
          duration: DataTypes.INTEGER,
          course_id: DataTypes.INTEGER,
          created_at: DataTypes.DATE,
          updated_at: DataTypes.DATE

        }).then(function () {
          migration.createTable('user_courses', {
            id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
            course_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'courses', key: 'id', onDelete: 'cascade' } },
            user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id', onDelete: 'cascade' } },
            number_of_students: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE
          }).then(function () {
            return done();
          });
        });
      });
    });
  },

  down: function (migration, DataTypes, done) {
    migration.dropTable('user_courses').then(function () {
      migration.dropTable('users').then(function () {
        migration.dropTable('courses').then(function () {
          migration.dropTable('lectures').then(function () {
            return done();
          });
        });
      });
    });
  }
};