module.exports = function (config) {
    config.set({

        basePath : '../',

        files : [
            'test/unit/spec.bundle.js',

            {
                pattern: 'mocked_backend/**/*.json'
            }
        ],

        autoWatch : true,

        frameworks: ['jasmine', 'fixture'],

        browsers: ['PhantomJS'],

        reporters: ['progress', 'coverage'],

        jsonFixturesPreprocessor: {
            variableName: '__json__'
        },

        plugins : [
            'karma-jasmine',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-fixture',
            'karma-json-fixtures-preprocessor',
            'karma-phantomjs-launcher',
            'karma-notify-reporter',
            'karma-webpack',
            'karma-sourcemap-loader',
        ],

        preprocessors: {
            // 'app/**/*.js': ['webpack', 'coverage'],
            // 'app/common/locales/**/*.json': ['webpack'],
            'test/unit/spec.bundle.js': ['webpack', 'sourcemap'/*, 'coverage'*/],
            'mocked_backend/**/*.json': ['json_fixtures'],
            // 'app/**/*.html': ['ng-html2js']
        },

        // ngHtml2JsPreprocessor: {
        //     stripPrefix: 'app/',
        //     prependPrefix: 'templates/',
        //     moduleName: 'client-templates'
        // },

        webpack: require('../webpack.test.config'),

        webpackServer: {
          noInfo: true // prevent console spamming when running in Karma!
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

        logLevel: config.LOG_INFO

    });
};
