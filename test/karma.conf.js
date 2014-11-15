module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
        'node_modules/angular/angular.js',
        'node_modules/angular-translate/dist/angular-translate.js',
        'node_modules/angular-resource/angular-resource.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'app/post/**/*.js',
        'app/controllers/**/*.js',
        'app/directives/**/*.js',
        'app/interceptors/**/*.js',
        'app/locales/**/*.json',
        'app/services/**/*.js',
        'app/global-event-handlers.js',
        'app/locale-config.js',
        'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine', 'commonjs'],

    browsers: ['Chrome', 'Firefox'],

    reporters: ['progress', 'coverage'],

    plugins : [
        'karma-jasmine',
        'karma-coverage',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-commonjs'
    ],

    preprocessors: {
        'app/**/*.js': ['commonjs', 'coverage'],
        'app/locales/**/*.json': ['commonjs'],
        'test/unit/**/*.js': ['commonjs']
    },

    coverageReporter: {
        reporters: [
            {
                type : 'text'
            },
            {
                type : 'lcov',
                dir : 'test/coverage/',
                file : 'lcov.info'
            }
        ]
    },

    logLevel: config.LOG_INFO,

  });
};
