const path = require('path');
const gulp = require('gulp');
const rimraf = require('rimraf');
const $ = (require('gulp-load-plugins'))();
const isparta = require('isparta');
const Server = require('karma').Server;

const files = {
  src: {
    js: 'src/**/*.js',
    jade: 'src/**/*.jade',
    stylus: 'src/**/*.styl',
  },
  test: {
    js: 'test/**/*.js',
  },
  mock: {
    js: 'mock/**/*.js',
  },
  conf: {
    js: '*.js',
  },
  doc: 'doc/**/*',
};

const dirs = {
  src: 'src',
  dst: 'dst',
  doc: 'doc',
};

gulp.task('default', ['build']);

gulp.task('js', function() {
  return gulp.src(files.src.js, {base: dirs.src})
//    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.header(
      "if(typeof exports === 'undefined' && typeof window !== 'undefined')"
      + ' var exports = window;\n'
    ))
//    .pipe($.uglify())
//    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.dst));
});

gulp.task('jade', function() {
  return gulp.src(files.src.jade, {base: dirs.src})
//    .pipe($.sourcemaps.init())
    .pipe($.jade())
//    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.dst));
});

gulp.task('stylus', function() {
  return gulp.src(files.src.stylus, {base: dirs.src})
//    .pipe($.sourcemaps.init())
    .pipe($.stylus())
//    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.dst));
});

gulp.task('build', ['js', 'jade', 'stylus', 'test', 'lint', 'doc']);

gulp.task('test', ['test-node', 'test-browser']);

gulp.task('test-cli', ['test-node', 'test-browser-cli']);

gulp.task('pre-test', function() {
  return gulp.src(files.src.js)
    .pipe($.istanbul({instrumenter: isparta.Instrumenter}))
    .pipe($.istanbul.hookRequire())
    .pipe(gulp.dest('test-tmp'));
});

gulp.task('test-node', ['pre-test'], function() {
  return gulp.src(files.test.js, {read: false})
    .pipe($.mocha())
    .pipe($.istanbul.writeReports());
});

gulp.task('test-browser', ['pre-test'], function(done) {
  return new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
      singleRun: true,
    },
    done
  ).start();
});

gulp.task('test-browser-cli', ['pre-test'], function(done) {
  return new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
      singleRun: true,
      frameworks: ['phantomjs-shim', 'mocha-debug', 'mocha'],
      browsers: ['PhantomJS'],
    },
    done
  ).start();
});

gulp.task('test-browser-watch', ['pre-test'], function(done) {
  return new Server(
    {
      configFile: path.join(__dirname, '/karma.conf.js'),
    },
    done
  ).start();
});

gulp.task('lint', function() {
  return gulp.src(
    [files.src.js, files.test.js, files.mock.js, files.conf.js],
    {base: '.'}
  )
    .pipe($.eslint({useEslintrc: true}))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('lint-fix', function() {
  return gulp.src(
    [files.src.js, files.test.js, files.mock.js, files.conf.js],
    {base: '.'}
  )
    .pipe($.eslint({useEslintrc: true, fix: true}))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
    .pipe(gulp.dest('.'));
});

gulp.task('clean-doc', function(done) {
  return rimraf(files.doc, done);
});

gulp.task('doc', ['clean-doc'], function() {
  return gulp.src(dirs.src, {read: false, base: dirs.src})
    .pipe($.esdoc({destination: dirs.doc}));
});

gulp.task('watch', function() {
  gulp.start(['js', 'test-node', 'test-browser-watch', 'lint', 'doc']);
  return $.watch([files.src.js, files.test.js], function() {
    return gulp.start(['js', 'test-node', 'lint', 'doc']);
  });
});


gulp.task('w', function() {
  gulp.start(['js', 'jade', 'stylus', 'lint', 'test-node']);
  return $.watch([files.src.js, files.src.jade, files.src.stylus], function() {
    return gulp.start(['js', 'jade', 'stylus', 'lint', 'test-node']);
  });
});
