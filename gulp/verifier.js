
import log       from 'fancy-log';
import c         from 'ansi-colors';
import fetch from 'node-fetch';
import * as forms from '../mocked_backend/api/v3/forms.json';
import * as tags from '../mocked_backend/api/v3/tags.json';
import * as features from '../mocked_backend/api/v3/config/features.json';
import * as map from '../mocked_backend/api/v3/config/map.json';
import * as verifier from '../app/common/verifier/verifier.js';

module.exports.verifyNetwork = function() {
    let checkDisabled = verifier.isCheckDisabled('NETWORK');
    if (checkDisabled) {
        log.info(c.bold('Checking network:'));
        formatMessage(checkDisabled.messages, checkDisabled.type);
        return;
    }

    verifier.verifyStatus(`${process.env.BACKEND_URL}/api/v3/config`)
        .then(response => {
        log.info(c.bold('Checking network:'));
        log.info(`The server responded with a ${response.status} code.`);
        response.messages.forEach(message => {
            formatMessage(message, response.type);
        });
    });
};

module.exports.verifyEnv = function() {
    let checkDisabled = verifier.isCheckDisabled('ENV');
    if (checkDisabled) {
        log.info(c.bold('Checking .env-variables:'));
        formatMessage(checkDisabled.messages, checkDisabled.type);
        return;
    }

    let envCheck = verifier.verifyEnv();

    log.info(c.bold(`Checking .env-variables:`));
    envCheck.messages.forEach(message => {
        formatMessage(message, envCheck.type);
    });
};

module.exports.verifyTransifex = function() {
    if (isCheckDisabled('TRANSIFEX')) {
        log.info(c.green('USH_DISABLE_CHECKS contains TRANSIFEX, skipping TRANSIFEX verification process.'));
        return;
    }
    let transifexCheck = verifier.verifyTransifex();
    log.info(c.bold(`Checking credentials for Transifex:`));
    transifexCheck.messages.forEach(message => {
        formatMessage(message, transifexCheck.type);
    });
};

module.exports.verifyEndpointStatus = function() {
    let checkDisabled = verifier.isCheckDisabled('ENDPOINT_STATUS');
    if (checkDisabled) {
        log.info(c.bold('Checking status for endpoints:'));
        formatMessage(checkDisabled.messages, checkDisabled.type);
        return;
    }
    const endpoints = ['tags', 'forms', 'config/features', 'config/map'];
    endpoints.forEach(function(endpoint) {
        verifier.verifyStatus(`${process.env.BACKEND_URL}/api/v3/${endpoint}`)
        .then(response => {
            log.info(c.bold('Checking status for endpoints:'));
            log.info(c.bold(`Status-result for ${response.url}:`));
            log.info(`The server responded with a ${response.status} code.`);
            response.messages.forEach(message => {
                formatMessage(message, response.type);
            });
        });
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
                    
                    checkStructure(jsonData, structure, response.url);
            });
        });
    }).catch(error => {
        log.error(c.red('The server could not be reached or there was an error in the request'));
        log.error(c.red('Make sure your Platform API is running'));
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
                    let preferedStructure = { token_type: 'Bearer', expires_in: '', access_token: ''};
                    checkStructure(jsonData, preferedStructure, response.url);
                    checkToken(jsonData.access_token);
                });
                break;
            case '500':
                log.error(c.red('Oh noes. This does not look good.'));
                log.eror(c.red('Please check storage/logs in the Platform API, and see what the logs say about this error.'));
                break;
            case '401':
                log.error(c.red('Make sure your database-migrations has ran by running ./phinx migrate in the root directory of the platform API'));
                log.error(c.red('If you have added your own client id and name, make sure the values in the .env file matches the database.'));
                break;
        }
    }).catch(error => {
        log.error(c.red('The server could not be reached or there was an error in the request'));
        log.error(c.red('Make sure your Platform API is running'));
        log.error(c.red(error));
    });
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
                log.eror(c.red('Please check storage/logs in the Platform API, and see what the logs say about this error.'));
                break;
            case '401':
                log.error(c.red('Did you add your own client_secret and client_key?'));
                log.error(c.red('Make sure you updated the database with the same values'));
                log.error(c.red('If you did not add your own secret and key, check that the database-migration has ran, by running ./phinx migrate in the root directory of the Platform API.'));
                break;
            case '403':
                log.error(c.red('There is a problem with the oauth-scopes'));
                log.error(c.red('Check that your Platform API is set up and that all migrations has ran.'));
                break;
        }
    }).catch(err => {
        log.error(c.red('The server could not be reached or there was an error in the request'));
        log.error(c.red('Make sure your Platform API is running'));
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

const checkStructure = function(a, b, url) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    log.info(c.bold(`Structure-result for ${url}:`));
    if (JSON.stringify(aKeys) === JSON.stringify(bKeys)) {
        log.info(c.green(`The structure for ${url} matches the expected, all good!`));
    } else {
        log.info(c.red(`Oh noes, the structure for ${url} does not match the expected `));
        log.info(c.red(`Make sure you have set up the database correctly `));
        log.info(c.red(`Check that all migrations has ran. You can check this by running ./phinx migrate in the root directory of the Platform API.`));
    }
};


const formatMessage = function(message, type) {
    switch (type) {
        case 'confirmation':
            log.info(c.green(message));
            break;
        case 'error':
            log.error(c.red(message));
            break;
        case 'warning':
            log.warn(c.yellow(message));
            break;
        default:
            log.info(message);
    }
};

module.exports.isCheckDisabled = isCheckDisabled;
