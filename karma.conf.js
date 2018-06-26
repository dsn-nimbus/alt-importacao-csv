// Karma configuration
// Generated on Wed Dec 24 2014 19:30:10 GMT-0200 (Horário brasileiro de verão)

var _karma = function(config)
{
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [

      'bower_components/angular/angular.js',
      'bower_components/angular-i18n/angular-locale_pt-br.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/select2/dist/js/select2.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/alt-select-service/dist/alt-select-service.js',
      'bower_components/alt-modal-service/dist/alt-modal-service.js',
      'bower_components/alt-alerta-flutuante/dist/alt-alerta-flutuante.js',
      'bower_components/alt-carregando-info/dist/alt-carregando-info.min.js',
      'bower_components/js-xlsx/dist/xlsx.full.min.js',
      'bower_components/moment/min/moment.min.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/latinize/latinize.js',

      'src/**/*.js',
      'tests/**/*-test.js'
    ],


    // list of files to exclude
    exclude: [
      'node_modules/',
      'dist/'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': 'coverage'
    },

    coverageReporter:
    {
      type: 'lcov',
      dir: 'coverage'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    plugins: [
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-ng-html2js-preprocessor'
    ],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    client: {
      captureConsole: true,
      mocha: {
        bail: true
      }
    }
  });
};


module.exports = _karma;
