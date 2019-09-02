import log       from 'fancy-log';
import c         from 'ansi-colors';
import * as verifier from '../app/common/verifier/verifier.js';

module.exports.verifyNetwork = function() {
    if (verifier.isCheckDisabled(process.env, 'NETWORK')) {
        return;
    }

    verifier.verifyNetwork(process.env)
        .then(response => {
            log.info(c.bold('Checking network:'));
            log.info(`The server responded with a ${response.status} code.`);
            response.messages.forEach(message => {
                formatMessage(message, response.type);
            });
        });
};

module.exports.verifyEnv = function() {
    if (verifier.isCheckDisabled(process.env, 'ENV')) {
        return;
    }
    let envCheck = verifier.verifyEnv(process.env);
    log.info(c.bold(`Checking .env-variables:`));
    envCheck.messages.forEach(message => {
        formatMessage(message, envCheck.type);
    });
};

module.exports.verifyTransifex = function() {
    if (verifier.isCheckDisabled(process.env, 'TRANSIFEX')) {
        return;
    }
    let transifexCheck = verifier.verifyTransifex(process.env);
    log.info(c.bold(`Checking credentials for Transifex:`));
    transifexCheck.messages.forEach(message => {
        formatMessage(message, transifexCheck.type);
    });
};

module.exports.verifyEndpointStatus = function() {
    if (verifier.isCheckDisabled('ENDPOINT_STATUS')) {
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
    if (verifier.isCheckDisabled('ENDPOINT_STRUCTURE')) {
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
    if (verifier.isCheckDisabled(process.env, 'OAUTH')) {
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
    if (verifier.isCheckDisabled(process.env, 'API_ENVS')) {
        return;
    }
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
    if (verifier.isCheckDisabled(process.env, 'DBCONNECTION')) {
        return;
    }
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

module.exports.isCheckDisabled = function(name) {
    return verifier.isCheckDisabled(process.env, name);
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
