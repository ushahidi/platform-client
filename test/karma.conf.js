module.exports = function (config) {
    config.set({

        basePath : '../',

        files : [
            'node_modules/angular/angular.js',
            'node_modules/angular-translate/dist/angular-translate.js',
            'node_modules/angular-resource/angular-resource.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/angular-cache/dist/angular-cache.js',
            'node_modules/underscore/underscore.js',
            'node_modules/angular-leaflet-directive/dist/angular-leaflet-directive.js',
            'node_modules/leaflet/dist/leaflet.js',
            'app/activity/**/*.js',
            'app/common/**/*.js',
            'app/post/**/*.js',
            'app/set/**/*.js',
            'app/setting/**/*.js',
            'app/user-profile/**/*.js',
            'app/common/locales/**/*.json',
            'test/unit/**/*.js',

            //include template files for directive testing
            'server/www/templates/**/*.html',

            {
                pattern: 'mocked_backend/**/*.json'
            }
        ],

        // we don't want to include the sub module manifest files
        // (like for user-profile or post),
        // because we want to compose our own test specific module definitions
        // and its dependencies
        // (especially when it comes to external libraries which we often want to
        // replace with mocks, like for angular-xeditable)
        exclude: [
            'app/**/*-module.js',
            'app/common/wrapper/nvd3-wrapper.js'
        ],

        autoWatch : true,

        frameworks: ['jasmine', 'commonjs', 'fixture'],

        browsers: ['Chrome', 'Firefox', 'PhantomJS'],

        reporters: ['progress', 'coverage'],

        jsonFixturesPreprocessor: {
            variableName: '__json__'
        },

        plugins : [
            'karma-jasmine',
            'karma-commonjs',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-fixture',
            'karma-html2js-preprocessor',
            'karma-ng-html2js-preprocessor',
            'karma-json-fixtures-preprocessor',
            'karma-phantomjs-launcher',
            'karma-notify-reporter'
        ],

        preprocessors: {
            'app/**/*.js': ['commonjs', 'coverage'],
            'app/common/locales/**/*.json': ['commonjs'],
            'test/unit/**/*.js': ['commonjs'],
            'mocked_backend/**/*.json': ['json_fixtures'],
            'server/www/templates/**/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'server/www/',
            moduleName: 'client-templates'
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
