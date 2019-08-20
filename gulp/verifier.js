
import log       from 'fancy-log';
import c         from 'ansi-colors';
import isUrl from 'is-url';
import fs        from 'fs';
import fetch from 'node-fetch';
import * as forms from '../mocked_backend/api/v3/forms.json';
import * as tags from '../mocked_backend/api/v3/tags.json';
import * as features from '../mocked_backend/api/v3/config/features.json';
import * as map from '../mocked_backend/api/v3/config/map.json';

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

module.exports.verifyEndpointStructure = function() {
    if (isCheckDisabled('ENDPOINTS_STRUCTURE')) {
            log.info(c.green('USH_DISABLE_CHECKS contains ENDPOINTS_STRUCTURE, skipping ENDPOINTS_STRUCTURE verification process.'));
            return;
    }
    const endpoints = ['tags', 'forms', 'config/features', 'config/map'];
    const requests = endpoints.map(function(endpoint) {
        return fetch(`${process.env.BACKEND_URL}/api/v3/${endpoint}`);
    });

    Promise.all(requests)
    .then(function(responses) {
        responses.forEach(function(response) {
            response.json().then(function(jsonData) {
                let structure = {};
                    switch (response.url.substring(response.url.lastIndexOf('/') + 1)) {
                        case 'tags':
                            structure = tags.default;
                            break;
                        case 'forms':
                            structure = forms.default;
                            break;
                        case 'features':
                            structure = features.default;
                            break;
                        case 'map':
                            structure = map.default;
                            break;
                    }
                    log.info(c.bold(`Structure-result for ${response.url}:`));
                    if (compareKeys(jsonData, structure)) {
                        log.info(c.green(`The structure for ${response.url} matches the expected, all good!`));
                    } else {
                        log.info(c.red(`Oh noes, the structure for ${response.url} does not match the expected `));
                        log.info(c.red(`Make sure you have set up the database correctly and ran all migrations.`));
                        log.info(c.red(`Hint: Check the logs in the platform-api for further error-logs`));
                    }
            });
        });
    }).catch(error => {
        log.error(c.red('The server could not be reached or there was an error in the request'));
        log.error(c.red('Make sure your platform-api is running'));
        log.error(c.red(error));
    });
};

module.exports.verifyOauth = function () {
    if (isCheckDisabled('ENDPOINTS_STRUCTURE')) {
        log.info(c.green('USH_DISABLE_CHECKS contains ENDPOINTS_STRUCTURE, skipping ENDPOINTS_STRUCTURE verification process.'));
        return;
    }

    let body = JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.OAUTH_CLIENT_ID || 'ushahidiui',
        client_secret: process.env.OAUTH_CLIENT_SECRET || '35e7f0bca957836d05ca0492211b0ac707671261',
        scope: 'forms'});

    fetch(`${process.env.BACKEND_URL}/oauth/token`, {
        method:'POST',
        body: body,
        headers: {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'}
    })
    .then(function(response) {
        log.info(c.bold(`Status-result for ${response.url}:`));
        log.info(`The server responded with a ${response.status} code.`);        
        switch (response.status.toString()) {
            case '200':
                log.info(c.green('All is good. This is the expected result.'));
                response.json().then(jsonData=>{
                    log.info(c.bold(`Structure-result for ${response.url}:`));
                    checkOauthStructure(jsonData);
                    checkToken(jsonData.access_token);
                });
                break;
            case '500':
                log.error(c.red('Oh noes. This does not look good.'));
                log.eror(c.red('Please check storage/logs in the platform-api, and see what the API logs say about this error.'));
                break;
            case '401':
                log.error(c.red('Make sure your database-migrations has ran'));    
                log.error(c.red('If you have added your own client id and name, make sure the values in the .env file matches the database.'));
                log.error(c.red('Make sure your database-migrations has ran'));
                break;
        }
    }).catch(error => {
        log.error(c.red('The server could not be reached or there was an error in the request'));
        log.error(c.red('Make sure your platform-api is running'));
        log.error(c.red(error));
    });
};

const checkOauthStructure = function (jsonData) {
        let structure = { token_type: 'Bearer', expires_in: '', access_token: ''};
        if (compareKeys(jsonData, structure)) {
            log.info(c.green(`The structure for ${jsonData.url} matches the expected, all good!`));
        } else {
            log.info(c.red(`Oh noes, the structure for ${jsonData.url} does not match the expected `));
            log.info(c.red(`Make sure you have set up the database correctly and ran all migrations.`));
            log.info(c.red(`Hint: Check the logs in the platform-api for further error-logs`));
        }
};

const checkToken = function (token) {
    fetch(`${process.env.BACKEND_URL}/api/v3/forms`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function (response) {
        log.info(c.bold(`Result for token-check:`));
        log.info(`The server responded with a ${response.status} code.`);
        switch (response.status.toString()) {
            case '200':
                log.info(c.green('All is good. This is the expected result.'));
                break;
            case '500':
                log.error(c.red('Oh noes. This does not look good.'));
                log.eror(c.red('Please check storage/logs in the platform-api, and see what the API logs say about this error.'));
                break;
            case '401':
                log.error(c.red('Did you add your own client_secret and client_key?'));
                log.error(c.red('Make sure you updated the database with the same values'));
                log.error(c.red('If you did not add your own secret and key, check that the database-migration has ran.'));
                break;
            case '403':
                log.error(c.red('There is a problem with the oauth-scopes'));
                log.error(c.red('Check that your api is set up and that all migrations has ran.'));
                break;
        }
    }).catch(err => {
        log.error(c.red('The server could not be reached or there was an error in the request'));
        log.error(c.red('Make sure your platform-api is running'));
        log.error(c.red(err));
    });
};

const isCheckDisabled = function(name) {
    if (!process.env.USH_DISABLE_CHECKS) {
        return false;
    }
    const checks = process.env.USH_DISABLE_CHECKS.split(',');
    return checks.indexOf(name) >= 0;
};

const compareKeys = function(a, b) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};

module.exports.isCheckDisabled = isCheckDisabled;
