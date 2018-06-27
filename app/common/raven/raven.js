import angular from 'angular';
import ravenService from './raven.service';

let ravenModule;
// Load raven if configured
if (RAVEN_URL) {
    let Raven = require('raven-js');

    Raven
        .config(RAVEN_URL, {
            release: GIT_COMMIT,
            environment: ENVIRONMENT,
            tags: {
                git_commit: GIT_COMMIT
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
        if (RAVEN_URL) {
            ravenService.init();
        }
    }])

    .name;

} else {
    ravenModule = angular.module('app.raven', []).name;
}

export default ravenModule;
