'use strict';

module.exports = {
  up: (migration, Sequelize, done) => {
    var t = new Date();

    var permissions = [
      { name: 'Manage courses', created_at: t, updated_at: t },
      { name: 'Manage users', created_at: t, updated_at: t },
      { name: 'Assign user to course', created_at: t, updated_at: t },
      { name: 'View my courses', created_at: t, updated_at: t },
      { name: 'Create exercise', created_at: t, updated_at: t },
      { name: 'Download exercise', created_at: t, updated_at: t },
      { name: 'Submit exercise', created_at: t, updated_at: t },
    ];

    var permission_roles = [
      { permission_id: 1, role_id: 3, created_at: t, updated_at: t },
      { permission_id: 2, role_id: 3, created_at: t, updated_at: t },
      { permission_id: 3, role_id: 3, created_at: t, updated_at: t },
      { permission_id: 4, role_id: 1, created_at: t, updated_at: t },
      { permission_id: 4, role_id: 2, created_at: t, updated_at: t },
      { permission_id: 5, role_id: 2, created_at: t, updated_at: t },
      { permission_id: 6, role_id: 2, created_at: t, updated_at: t },
      { permission_id: 7, role_id: 1, created_at: t, updated_at: t },
    ];

    migration.bulkInsert('permissions', permissions).then(function () {
      migration.bulkInsert('permission_roles', permission_roles).then(function () {
        return done();
      });
    });
  },

  down: (migration, Sequelize, done) => {
    migration.bulkDelete('permission_roles', null).then(function () {
      migration.bulkDelete('permissions', null).then(function () {
        return done();
      });
    });
  }
};
