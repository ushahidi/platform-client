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
                    data.message = data.message.replace(/"(Authorization|client_secret|password|accessToken)":"(.*?)"/, '"$1":"****"');
                }

                if (data.fingerprint) {
                    data.fingerprint.forEach((value, index) => {
                        data.fingerprint[index] = value.replace(/"(Authorization|client_secret|password|accessToken)":"(.*?)"/, '"$1":"****"');
                    });
                }

                if (data.breadcrumbs && data.breadcrumbs.values) {
                    data.breadcrumbs.values.forEach((value, index) => {
                        if (value.message) {
                            data.breadcrumbs.values[index].message = value.message.replace(/"(Authorization|client_secret|password|accessToken)":"(.*?)"/, '"$1":"****"');
                        }
                    });
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
