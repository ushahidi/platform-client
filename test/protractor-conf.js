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
