require('angular/angular');
require('angular-route/angular-route');
require('angular-resource/angular-resource');
require('./modules/ui-tabs');
require('angular-ui-bootstrap/src/dropdown/dropdown');
require('angular-ui-bootstrap/src/collapse/collapse');
require('angular-ui-bootstrap/src/transition/transition');
require('angular-ui-bootstrap/src/accordion/accordion');

// this 'environment variable' will be set within the gulpfile
var backendUrl = process.env.backend_url;

angular.module('app', ['ngRoute', 'ngResource', 'ui.bootstrap.dropdown', 'ui.bootstrap.collapse', 'ui.bootstrap.accordion', 'ui.bootstrap.transition', 'ui.tabs'])
    .constant('BACKEND_URL', backendUrl)
    .constant('API_URL', backendUrl + '/api/v2')
    .constant('OAUTH_CLIENT_ID', 'ushahidiui')
    .constant('OAUTH_CLIENT_SECRET', '35e7f0bca957836d05ca0492211b0ac707671261')

    .directive('postPreview', require('./directives/post-preview.js'))
    .directive('signinSignoutButton', require('./directives/signin-signout-button.js'))

    .service('Authentication', require('./services/authentication.js'))
    .service('PostData', require('./services/data/post.js'))

    .controller('navigation', require('./controllers/navigation.js'))
    .controller('workspaceAccordion', require('./workspace'))
    .controller('userFilter', require('./controllers/users/filter.js'))

    .config(require('./interceptors/authentication.js'))
    .config(require('./routes'))
    .config(require('./modules/ui-accordion'))

    .run(require('./global-event-handlers.js'));
