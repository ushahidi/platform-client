// import log       from 'fancy-log';
import isUrl from 'is-url';
import fs from 'fs';
import fetch from 'node-fetch';
// import * as forms from '../../../../mocked_backend/api/v3/forms.json';
// import * as tags from '../../../../mocked_backend/api/v3/tags.json';
// import * as features from '../../../../mocked_backend/api/v3/config/features.json';
// import * as map from '../../../../mocked_backend/api/v3/config/map.json';

module.exports = {
    verifyStatus(url, options) {
        let results;
        return fetch(url, options)
            .then((response, resolve) => {
                switch (response.status.toString()) {
                    case '200':
                        results = {
                            type: 'confirmation',
                            messages: ['All is good. This is the expected result.'],
                            url: response.url,
                            status: response.status
                        };
                        break;
                    case '404':
                        results = {
                            type: 'error',
                            messages: ['Make sure the API\'s BACKEND_URL in the .env file is the base URL to your Platform API.'],
                            url: response.url,
                            status: response.status
                        };
                        break;
                    case '403':
                        results = {
                            type: 'error',
                            messages: ['Make sure the API\'s BACKEND_URL in the .env file is the base URL to your Platform API.'],
                            url: response.url,
                            status: response.status
                        };
                        break;
                    case '500':
                        results = {
                            type: 'error',
                            messages: ['Oh noes. This does not look good.', 'Please check storage/logs in the Platform API, and see what the logs say about this error.'],
                            url: response.url,
                            status: response.status
                        };
                        break;
                }
                return results;
            })
            .catch(error => {
                results = {
                        type: 'error',
                        messages: ['The server could not be reached or there was an error in the request', 'Make sure the BACKEND_URL is in your .env-file', error],
                        url: `${process.env.BACKEND_URL}/${url}`
                    };
                return results;
            });
    },
    verifyEnv() {
        let messages = [];
        try {
            // fs is not working in the browser, how handle it?
            fs.accessSync('.env');
        } catch (e) {
            messages.push('.env file not found. Please create the .env file in the project\'s root directory.');
        }

        if (!process.env.BACKEND_URL) {
            messages.push('BACKEND_URL not found in .env file.', 'Please add this URL to the .env file to connect to the Platform API.');
        }

        if (process.env.BACKEND_URL && !isUrl(process.env.BACKEND_URL)) {
            messages.push('BACKEND_URL found in .env file. Is not a valid URL.',
            'Please fix the BACKEND_URL in the .env file to connect to the Platform API.');
        }
        return messages.length > 0 ? {type: 'error', messages: messages} : {type: 'confirmation', messages: ['All good, the .env file contains required variables']};
    },
    verifyTransifex() {
        if (!process.env.TX_USERNAME || !process.env.TX_PASSWORD) {
            return {type: 'warning', messages: ['TX_USERNAME and TX_PASSWORD not found in .env file. This might be ok if you are only using English, but it will not allow you to use any other languages.', 'If you need languages other than English, you will need to create a transifex account and setup the TX_USERNAME and TX_PASSWORD variables in the .env file']};
        } else {
            return {type: 'confirmation', messages: ['All good, TX_USERNAME and TX_PASSWORD found in .env file.']};
        }
    },
    isCheckDisabled(name) {
        if (!process.env.USH_DISABLE_CHECKS) {
            return false;
        }
        const checks = process.env.USH_DISABLE_CHECKS.split(',');
        if (checks.indexOf(name) >= 0) {
            return {type: 'warning', messages: `USH_DISABLE_CHECKS contains ${name}, skipping ${name} verification process.`};
        }
    },
    checkStructure (a, b, url) {
        const aKeys = Object.keys(a).sort();
        const bKeys = Object.keys(b).sort();
        if (JSON.stringify(aKeys) === JSON.stringify(bKeys)) {
            return {type: 'confirmation', messages: [`The structure for ${url} matches the expected, all good!`]};
        } else {
            return {type: 'error', messages: [`Oh noes, the structure for ${url} does not match the expected `,`Make sure you have set up the database correctly `,`Check that all migrations has ran. You can check this by running ./phinx migrate in the root directory of the Platform API.`]};
        }
    }
};
