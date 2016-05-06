var config = {
    allScriptsTimeout: 11000,
    getPageTimeout: 30000,

    suites: {
        post_views: './e2e/post/views/*.js',
        settings: './e2e/settings/*.js',
        full: './e2e/*.js'
    },

    baseUrl: 'http://localhost:8080/',

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

    rootElement: 'html'
};


// configuration for sauce labs selenium testing when running specs on travis-ci
if (process.env.TRAVIS_BUILD_NUMBER) {
    config.directConnect = false;
    config.seleniumAddress = 'http://' + process.env.SELENIUM_HOST + ':' + process.env.SELENIUM_PORT + '/wd/hub';
    config.capabilities = {
        'browserName': 'chrome',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'name': 'Ushahidi Angular Client: Protractor e2e specs',
        //'platform': 'Windows',
        //'resolution': '1280x1024',
        'build': process.env.BS_AUTOMATE_BUILD,
        'project': process.env.BS_AUTOMATE_PROJECT,
        'browserstack.user': process.env.BROWSERSTACK_USERNAME,
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        'browserstack.local': 'true'
    };
}

exports.config = config;
