'use strict';

module.exports = {
  up: (migration, Sequelize, done) => {
    var t = new Date();

    var roles = [
      { name: 'Student', role_type: 0, created_at: t, updated_at: t },
      { name: 'Teacher', role_type: 1, created_at: t, updated_at: t },
      { name: 'Academic Section', role_type: 2, created_at: t, updated_at: t },
      { name: 'Admin', role_type: 3, created_at: t, updated_at: t }
    ];

    var users = [
      { username: 'admin', full_name: 'PA Admin', password: 'e10adc3949ba59abbe56e057f20f883e', email: 'admin@gmail.com', role_id: 3, created_at: t, updated_at: t },
      { username: 'quoclv', full_name: 'Quoc Lam Vi', password: 'e10adc3949ba59abbe56e057f20f883e', email: 'quoclv@gmail.com', role_id: 2, created_at: t, updated_at: t },
      { username: 'tuhm', full_name: 'Huynh Minh Tu', password: 'e10adc3949ba59abbe56e057f20f883e', email: 'hmtu@gmail.com', role_id: 1, created_at: t, updated_at: t },
      { username: 'cuongnp', full_name: 'Nguyen Phu Cuong', password: 'e10adc3949ba59abbe56e057f20f883e', email: 'npcuong@gmail.com', role_id: 1, created_at: t, updated_at: t },
      { username: 'ngocpb', full_name: 'Pham Bich Ngoc', password: 'e10adc3949ba59abbe56e057f20f883e', email: 'pbngoc@gmail.com', role_id: 0, created_at: t, updated_at: t },
    ];

    var courses = [
      { name: 'How to Self-Study English Online', description: 'its a struggle to self-study anything, let alone a language! Languages were created for the sole purpose of communicating with others. So, is it possible to self-study English online? Of course it is!', requirement: 'Students will need a printer to print out the PDF documents to guide them through the process', duration: 12, created_at: t, updated_at: t, image: 'http://localhost:8765/course_image/english_1.PNG' },
      { name: 'Complete English Course - English Speaking - English Grammar', description: 'Complete English Course - English Speaking - English Grammar', requirement: 'You should be able to use a PC at a beginner level', duration: 24, created_at: t, updated_at: t, image: 'http://localhost:8765/course_image/english_2.jpg' },
      { name: ' Master Polite English ', description: 'Learn common polite phrases for a variety of communicative functions, such as complaining, interrupting, expressing disappointment and many more. New lessons are added all the time.', requirement: 'You need to have an Intermediate level of English.', duration: 24, created_at: t, updated_at: t, image: 'http://localhost:8765/course_image/english_3.jpg' },
    ];

    var lectures = [
      { name: 'Course and Teacher Introduction', description: 'Introduction about teacher and course', duration: 30, course_id: 1, created_at: t, updated_at: t },
      { name: 'How to Learn English Online', description: 'Introduction about how to learn English online', duration: 30, course_id: 1, created_at: t, updated_at: t },
      { name: 'How to Fill out the Goals Pyramid', description: 'Introduction about how to reach your goal in learning English', duration: 30, course_id: 1, created_at: t, updated_at: t },
      { name: 'Identifying Helpful Resources', description: 'Introduction about how to gather resources for learning English', duration: 30, course_id: 1, created_at: t, updated_at: t },
      { name: 'Create a Study Plan', description: 'Introduction about how to create a study plan for learning English', duration: 30, course_id: 1, created_at: t, updated_at: t },
      { name: 'How to Fill out the Study Plan', description: 'Introduction about how to make use of the study plan for learning English', duration: 30, course_id: 1, created_at: t, updated_at: t },
    ]

    var exercises = [
      { name: 'Exercise 1: Speaking', question: 'Introduction about you in English', answer: 'Your answer depend ', lecture_id: 2, course_id: 1, deadline: t, created_at: t, updated_at: t },
      { name: 'Exercise 2: Writing', question: 'Introduction about your family in English', answer: 'Your answer depend', lecture_id: 2, course_id: 1, deadline: t, created_at: t, updated_at: t },
      { name: 'Exercise 3: Listening', question: 'Introduction about your friends in English', answer: 'Your answer depend', lecture_id: 2, course_id: 1, deadline: t, created_at: t, updated_at: t }
    ]

    migration.bulkInsert('roles', roles).then(function () {
      migration.bulkInsert('users', users).then(function () {
        migration.bulkInsert('courses', courses).then(function () {
          migration.bulkInsert('lectures', lectures).then(function () {
            migration.bulkInsert('exercises', exercises).then(function () {
              return done();
            })
          })
        });
      });
    });
  },

  down: (migration, Sequelize, done) => {
    migration.bulkDelete('roles', null).then(function () {
      migration.bulkDelete('users', null).then(function () {
        migration.bulkDelete('courses', null).then(function () {
          migration.bulkDelete('lectures', null).then(function () {
            migration.bulkDelete('exercises', null).then(function () {
              return done();
            })
          })
        });
      });
    });
  }
};
