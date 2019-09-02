import log       from 'fancy-log';
import c         from 'ansi-colors';
import * as verifier from '../app/common/verifier/verifier.js';

module.exports.verifyNetwork = function() {
    const verifyNetwork = verifier.verifyNetwork(process.env);
    if (!verifyNetwork) {
        log.info(c.bold('Checking network:'));
        log.info('Network-check disabled in .env. Skipping check.');
        return;
    } else {
        verifyNetwork
        .then(response => {
            log.info(c.bold('Checking network:'));
            log.info(`The server responded with a ${response.status} code.`);
            response.messages.forEach(message => {
                formatMessage(message, response.type);
            });
        });
    }
};

module.exports.verifyEnv = function() {
    let envCheck = verifier.verifyEnv(process.env);
    log.info(c.bold(`Checking .env-variables in the client:`));
    if (!envCheck) {
        log.info('Check for environment-variables in client is disabled in .env. Skipping check.');
        return;
    } else {
        envCheck.messages.forEach(message => {
            formatMessage(message, envCheck.type);
        });
    }
};

module.exports.verifyTransifex = function() {
    let transifexCheck = verifier.verifyTransifex(process.env);
    log.info(c.bold(`Checking credentials for Transifex:`));
    if (!transifexCheck) {
        log.info('Check for Transifex credentials is disabled in .env. Skipping check.');
        return;
    } else {
        transifexCheck.messages.forEach(message => {
            formatMessage(message, transifexCheck.type);
        });
    }
};

module.exports.verifyEndpointStatus = function() {
    let verifyEndpointStatus = verifier.verifyEndpointStatus(process.env);
    if (!verifyEndpointStatus) {
        log.info(c.bold('Checking status for endpoints:'));
        log.info('Check for endpoint-status is disabled in .env. Skipping check.');
        return;
    } else {
        verifyEndpointStatus
        .forEach(response => {
            response.then(result => {
                log.info(c.bold('Checking status for endpoint:'));
                log.info(`Status-result for ${result.url}:`);
                log.info(`The server responded with a ${result.status} code.`);
                result.messages.forEach(message => {
                    formatMessage(message, result.type);
                });
            });
        });
    }
};

module.exports.verifyEndpointStructure = function() {
    const verifyEndpointStructure = verifier.verifyEndpointStructure(process.env);
    if (!verifyEndpointStructure) {
        log.info(c.bold('Checking Structure for endpoints:'));
        log.info('Check for endpoint-structure is disabled in .env. Skipping check.');
        return;
    } else {
        verifyEndpointStructure.forEach(response => {
            response.then(result => {
                log.info(c.bold('Checking structure for endpoint:'));
                log.info(`Structure-result for ${result.url}`);
                result.messages.forEach(message => {
                    formatMessage(message, result.type);
                });
            });
        });
    }
};

module.exports.verifyOauth = function () {
    let results = verifier.verifyOauth(process.env);
    if (!results) {
        log.info(c.bold('Checking Oauth-endpoint:'));
        log.info('Check for oauth endpoint is disabled in .env. Skipping check.');
        return;
    } else {
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
    }
};

module.exports.verifyAPIEnvs = function() {
    const verifyAPIEnvs = verifier.verifyAPIEnvs(process.env);
    if (!verifyAPIEnvs) {
        log.info(c.bold(`Checking the environment variables in the API:`));
        log.info('Check for the environment variables in the API is disabled in .env. Skipping check.');
        return;
    } else {
        verifyAPIEnvs
        .then(response => {
            log.info(c.bold(`Checking the environment variables in the API:`));
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
    }
};

module.exports.verifyDbConnection = function() {
    const verifyDbConnection = verifier.verifyDbConnection(process.env);
    if (!verifyDbConnection) {
        log.info(c.bold('Checking the database connection:'));
        log.info('Check for the database connection in the API is disabled in .env. Skipping check.');
        return;
    } else {
        verifyDbConnection
        .then(response => {
            log.info(c.bold('Checking the database connection:'));
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
    }
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
