'use strict'

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul');

const SOURCE_FILES = ['lib/**/*.js', 'services/**/*.js'];
const TEST_FILES = 'tests/**/*.test.js';
const COVERAGE_OUTPUT = 'tests/results/coverage';
const TEST_OUTPUT = 'tests/results/report';

gulp.task('pre-test', function () {
  return gulp.src(SOURCE_FILES)
    .pipe(istanbul({ includeUntested: true })) // Covering files
    .pipe(istanbul.hookRequire()); // Force `require` to return covered files
});

gulp.task('test', ['pre-test'], function () {
  var coverageOpts = { dir: COVERAGE_OUTPUT };
  var mochaOpts = {
    reporter: 'mochawesome',
    timeout: 30000,
    slow: 1,
    recursive: true,
    'no-exit': true,
    reporterOptions: {
      reportName: 'test-results',
      reportTitle: 'PA tool unit tests',
      inlineAssets: true,
      autoOpen: false,
      reportDir: TEST_OUTPUT
    }
  };

  gulp.src(TEST_FILES)
    .pipe(mocha(mochaOpts))
    .pipe(istanbul.writeReports(coverageOpts)) // Creating the reports after tests ran
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 10 } })) // Enforce a coverage of at least 90%
    .on('error', console.warn.bind(console))
});
