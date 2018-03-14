'use strict';

module.exports = {
  up: function (migration, DataTypes, done) {
    migration.createTable('permissions', {
      id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
      name: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    }).then(function () {
      migration.createTable('roles', {
        id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
        name: DataTypes.STRING,
        role_type: DataTypes.INTEGER, //0: student; 1: teacher; 2: section_academic, 3: admin
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
      }).then(function () {
        migration.createTable('permission_roles', {
          id: { autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER },
          permission_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'permissions', key: 'id', onDelete: 'cascade' } },
          role_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'roles', key: 'id', onDelete: 'cascade' } },
          created_at: DataTypes.DATE,
          updated_at: DataTypes.DATE
        }).then(function () {
          return done();
        });
      });
    });
  },

  down: function (migration, DataTypes, done) {
    migration.dropTable('permission_roles').then(function () {
      migration.dropTable('permissions').then(function () {
        migration.dropTable('roles').then(function () {
          return done();
        });
      });
    });

  }
};