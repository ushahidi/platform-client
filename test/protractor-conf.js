var config = {
    allScriptsTimeout: 11000,

    specs: [
    'e2e/*.js'
    ],

    baseUrl: 'http://localhost:8080/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },

    capabilities: {
        'browserName': 'chrome'
    }
};


// configuration for sauce labs selenium testing when running specs on travis-ci
if (process.env.TRAVIS_BUILD_NUMBER) {
  config.seleniumAddress = 'http://localhost:4445/wd/hub';
  config.capabilities = {
    'username': process.env.SAUCE_USERNAME,
    'accessKey': process.env.SAUCE_ACCESS_KEY,
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Ushahidi Angular Client: Protractor e2e specs'
  };
}

exports.config = config;
