let config = {
    allScriptsTimeout: 11000,
    getPageTimeout: 30000,

    suites: {
        post_views: './e2e/post/views/*.js',
        settings: './e2e/settings/*.js',
        auth: './e2e/auth/*.js'
    },

    baseUrl: 'http://localhost:3000/',

    framework: 'jasmine2',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 40000
    },

    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 2
    },

    directConnect: true,

    rootElement: 'html',

    onPrepare: function () {
        let disableNgAnimate = function () {
            angular
                .module('disableNgAnimate', [])
                .run(['$animate', function ($animate) {
                    $animate.enabled(false);
                }]);
        };

        let disableCssAnimate = function () {
            angular
                .module('disableCssAnimate', [])
                .run(function () {
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = '* {' +
                        '-webkit-transition: none !important;' +
                        '-moz-transition: none !important' +
                        '-o-transition: none !important' +
                        '-ms-transition: none !important' +
                        'transition: none !important' +
                        '}';
                    document.getElementsByTagName('head')[0].appendChild(style);
                });
        };

        browser.addMockModule('disableNgAnimate', disableNgAnimate);
        browser.addMockModule('disableCssAnimate', disableCssAnimate);

        protractor.helpers = require('./helpers.js');
    }
};


// configuration for sauce labs selenium testing when running specs on travis-ci
if (process.env.TRAVIS_BUILD_NUMBER) {
    config.directConnect = false;
    config.seleniumAddress = 'http://localhost:4445/wd/hub';
    config.capabilities = {
        'username': process.env.SAUCE_USERNAME,
        'accessKey': process.env.SAUCE_ACCESS_KEY,
        'browserName': 'chrome',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'name': 'Ushahidi Angular Client: Protractor e2e specs',
        'platform': 'Windows 8',
        'screen-resolution': '1280x1024'
    };
}

exports.config = config;
