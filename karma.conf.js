module.exports = (config) =>
  config.set({
    basePath: '',
    frameworks: ['detectBrowsers', 'phantomjs-shim', 'mocha-debug', 'mocha'],
    files: [
      'mock/browser-global-vars.js',
      'node_modules/power-assert/build/power-assert.js',
      'node_modules/shiorijk/lib/*.js',
      'node_modules/shiori_converter/lib/*.js',
      'src/**/*.js',
      'test/**/*.js',
    ],
    exclude: ['**/*.swp'],
    preprocessors: {
      'src/**/*.js': ['babel', 'coverage'],
      'test/**/*.js': ['babel'],
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: ['babel-plugin-espower'],
        sourceMap: true,
      },
      filename: (file) => file.originalPath.replace(/\.js$/, '.es5.js'),
      sourceFileName: (file) => file.originalPath,
    },
    coverageReporter: {
      reporters: [{type: 'lcov'}],
      instrumenters: {isparta: require('isparta')},
      instrumenter: {
        'src/**/*.js': 'isparta',
      },
      instrumenterOptions: {
        isparta: {
          babel: {
            presets: ['es2015'],
            plugins: ['babel-plugin-espower'],
            sourceMap: true,
          },
        },
      },
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false,
    concurrency: Infinity,
  });
