import angular from 'angular';
import ravenService from './raven.service';

const ravenUrl = window.ushahidi.ravenUrl || false;
let ravenModule;
// Load raven if configured
if (ravenUrl) {
    let Raven = require('raven-js');

    Raven
        .config(ravenUrl, {
            release: GIT_COMMIT,
            environment: window.ushahidi.environment || ENVIRONMENT,
            tags: {
                git_commit: GIT_COMMIT
            },
            sanitizeKeys: [/Authorization/i, /password/i, /accessToken/i, /api_key/i, /client_secret/i],
            dataCallback: (data) => {
                // Replace stringified sensitive info
                if (data.message) {
                    data.message = data.message.replace(/"Authorization":"(.*?)"/, '"Authorization":"****"');
                    data.message = data.message.replace(/"client_secret":"(.*?)"/, '"client_secret":"****"');
                    data.message = data.message.replace(/"password":"(.*?)"/, '"password":"****"');
                    data.message = data.message.replace(/"accessToken":"(.*?)"/, '"accessToken":"****"');
                }

                if (data.fingerprint && data.fingerprint[0]) {
                    data.fingerprint[0] = data.fingerprint[0].replace(/"Authorization":"(.*?)"/, '"Authorization":"****"');
                    data.fingerprint[0] = data.fingerprint[0].replace(/"client_secret":"(.*?)"/, '"client_secret":"****"');
                    data.fingerprint[0] = data.fingerprint[0].replace(/"password":"(.*?)"/, '"password":"****"');
                    data.fingerprint[0] = data.fingerprint[0].replace(/"accessToken":"(.*?)"/, '"accessToken":"****"');
                }
            }
        })
        .addPlugin(require('raven-js/plugins/angular'), angular)
        .install();

    ravenModule = angular.module('app.raven', [
        'ngRaven'
    ])

    .factory('Raven', () => {
        return Raven;
    })

    .service({
        ravenService
    })

    .run(['ravenService', (ravenService) => {
        if (ravenUrl) {
            ravenService.init();
        }
    }])

    .name;

} else {
    ravenModule = angular.module('app.raven', []).name;
}

export default ravenModule;
