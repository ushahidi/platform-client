import log       from 'fancy-log';
import c         from 'ansi-colors';
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

    let envCheck = verifier.verifyEnv(process.env);
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
    let transifexCheck = verifier.verifyTransifex(process.env);
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
    verifier.verifyEndpointStatus(process.env).forEach(response => {
            response.then(result => {
                log.info(c.bold('Checking status for endpoints:'));
                log.info(c.bold(`Status-result for ${result.url}:`));
                log.info(`The server responded with a ${result.status} code.`);
                result.messages.forEach(message => {
                    formatMessage(message, result.type);
                });
        });
    });
};

module.exports.verifyEndpointStructure = function() {
    if (isCheckDisabled('ENDPOINTS_STRUCTURE')) {
            log.info(c.green('USH_DISABLE_CHECKS contains ENDPOINTS_STRUCTURE, skipping ENDPOINTS_STRUCTURE verification process.'));
            return;
    }
    verifier.verifyEndpointStructure(process.env).forEach(response => {
                response.then(result => {
                    log.info(c.bold(`Structure-result for ${result.url}`));
                    result.messages.forEach(message => {
                    formatMessage(message, result.type);
                });
            });
        });
};

module.exports.verifyOauth = function () {
    if (isCheckDisabled('VERIFY_OAUTH')) {
        log.info(c.green('USH_DISABLE_CHECKS contains VERIFY_OAUTH, skipping VERIFY_OAUTH verification process.'));
        return;
    }

    let results = verifier.verifyOauth(process.env);
    results.status.then(status => {
        log.info(c.bold(`Status-result for ${status.url}:`));
        log.info(`The server responded with a ${status.status} code.`);
        status.messages.forEach(message => {
            formatMessage(message, status.type);
        });
    });

    results.structure.then(structure => {
        log.info(c.bold(`Structure-result for ${structure.url}:`));
        structure.messages.forEach(message => {
            formatMessage(message, structure.type);
        });
    });

    results.token.then(token => {
        log.info(c.bold('Testing the oauth-token:'));
        token.messages.forEach(message => {
            formatMessage(message, token.type);
        });
    });
};

module.exports.verifyAPIEnvs = function() {
    verifier.verifyAPIEnvs(process.env)
    .then(response => {
        log.info(c.bold(`Checking the environment variables in the API`));
        if (response.success) {
           response.success.forEach(result=>{
               formatMessage(result.message, 'confirmation');
           });
        } else if (response.errors) {
            response.errors.forEach(result=>{
                formatMessage(result.message, 'error');
            });
        }
    });
};

module.exports.verifyDbConnection = function() {
    verifier.verifyDbConnection(process.env)
    .then(response => {
        log.info(c.bold('Checking the database connection'));
        if (response.success) {
           response.success.forEach(result=>{
               formatMessage(result.message, 'confirmation');
           });
        } else if (response.errors) {
            response.errors.forEach(result=>{
                formatMessage(result.message, 'error');
            });
        }
    });
};

const isCheckDisabled = function(name) {
    if (!process.env.USH_DISABLE_CHECKS) {
        return false;
    }
    const checks = process.env.USH_DISABLE_CHECKS.split(',');
    return checks.indexOf(name) >= 0;
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
