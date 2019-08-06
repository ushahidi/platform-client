
import log       from 'fancy-log';
import c         from 'ansi-colors';
import isUrl from 'is-url';
import fs        from 'fs';
import fetch from 'node-fetch';

module.exports.verifyNetwork = function() {
    if (isCheckDisabled('NETWORK')) {
      log.info(c.green('USH_DISABLE_CHECKS contains NETWORK, skipping API connectivity verification process.'));
      return;
    }
    fetch(`${process.env.BACKEND_URL}/api/v3/config`)
    .then(function(response) {
      log.info(`The server responded with a ${response.status} code.`);
      switch (response.status.toString()) {
        case '200':
          log.info(c.green('All is good. This is the expected result.'));
          break;
        case '500':
          log.error(c.red('Oh noes. This does not look good.'));
          log.eror(c.red('Please check storage/logs in the platform-api, and see what the API logs say about this error.'));
          break;
        case '404':
          log.error(c.red('Make sure the API\'s BACKEND_URL in the .env file is the base URL to your platform API.'));
          break;
        // case '403':
        //   log.error(c.red('Make sure the API\'s BACKEND_URL in the .env file is the base URL to your platform API.'));
        //   break;
      }
    }).catch(error => {
      log.error(c.red('The server could not be reached or there was an error in the request'));
      log.error(c.red(error));
    });
};

module.exports.verifyEnv = function() {
    if (isCheckDisabled('ENV')) {
        log.info(c.green('USH_DISABLE_CHECKS contains ENV, skipping ENV verification process.'));
        return;
    }
    try {
        fs.accessSync('.env');
    } catch (e) {
        log.error(c.red('.env file not found. Please create the .env file in the project\'s root directory.'));
    }

    if (!process.env.BACKEND_URL) {
        log.error(
        c.red('BACKEND_URL not found in .env file. ' +
                'Please add this URL to the .env file to connect to the Ushahidi platform server.'
            )
        );
    }
    if (process.env.BACKEND_URL && !isUrl(process.env.BACKEND_URL)) {
        log.error(
        c.red('BACKEND_URL found in .env file. Is not a valid URL.' +
                'Please fix the API endpoint URL in the .env file to connect to the Ushahidi platform server.'
            )
        );
    }
};

module.exports.verifyTransifex = function() {
    if (isCheckDisabled('TRANSIFEX')) {
        log.info(c.green('USH_DISABLE_CHECKS contains TRANSIFEX, skipping TRANSIFEX verification process.'));
        return;
    }
    if (!process.env.TX_USERNAME || !process.env.TX_PASSWORD) {
        log.warn(
        c.yellow('TX_USERNAME and TX_PASSWORD not found in .env file.' +
                        'This might be ok if you are only using English, ' +
                        'but it will not allow you to use any other languages.'
                    )
        );
        log.warn(
        c.yellow('If you need languages other than English, you will need to create a transifex account ' +
                'and setup the TX_USERNAME and TX_PASSWORD variables in the .env file')
        );
    }
};

module.exports.verifyEndpointStatus = function() {
    if (isCheckDisabled('ENDPOINTS_STATUS')) {
            log.info(c.green('USH_DISABLE_CHECKS contains ENDPOINTS_STATUS, skipping ENDPOINTS_STATUS verification process.'));
            return;
    }
    const endpoints = ['tags', 'forms', 'config/features', 'config/map'];
    const requests = endpoints.map(function(endpoint) {
        return fetch(`${process.env.BACKEND_URL}/api/v3/${endpoint}`);
    });

    Promise.all(requests)
    .then(function(responses) {
        responses.forEach(function(response) {
            log.info(c.bold(`Status-result for ${response.url}:`));
            log.info(`The server responded with a ${response.status} code.`);
            switch (response.status.toString()) {
                case '200':
                    log.info(c.green('All is good. This is the expected result.'));
                    break;
                case '500':
                    log.error(c.red('Oh noes. This does not look good.'));
                    log.eror(c.red('Please check storage/logs in the platform-api, and see what the API logs say about this error.'));
                    break;
                case '404':
                    log.error(c.red('Make sure the API\'s BACKEND_URL in the .env file is the base URL to your platform API.'));
                    break;
            }
        });
    }).catch(error => {
        log.error(c.red('The server could not be reached or there was an error in the request'));
        log.error(c.red('Make sure your platform-api is running'));
        log.error(c.red(error));
    });
};

const isCheckDisabled = function(name) {
    if (!process.env.USH_DISABLE_CHECKS) {
        return false;
    }
    const checks = process.env.USH_DISABLE_CHECKS.split(',');
    return checks.indexOf(name) >= 0;
};

module.exports.isCheckDisabled = isCheckDisabled;
