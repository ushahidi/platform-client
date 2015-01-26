require('angular/angular');
require('angular-route/angular-route');
require('leaflet/dist/leaflet');
require('angular-leaflet-directive/dist/angular-leaflet-directive');
require('angular-resource/angular-resource');
require('angular-translate');
require('angular-ui-bootstrap/src/dropdown/dropdown');
require('angular-ui-bootstrap/src/collapse/collapse');
require('angular-ui-bootstrap/src/tabs/tabs');
require('angular-ui-bootstrap/src/transition/transition');
require('angular-ui-bootstrap/src/pagination/pagination');
require('angular-mocks/angular-mocks');
require('angular-moment/angular-moment');
require('angular-sanitize/angular-sanitize');
require('angular-markdown-directive/markdown.js');
require('angular-local-storage');
require('checklist-model/checklist-model');

require('./post/post-module.js');
require('./tool/tool-module.js');
require('./user-profile/user-profile-module.js');
require('./workspace/workspace-module.js');

// this 'environment variable' will be set within the gulpfile
var backendUrl = process.env.backend_url;

angular.module('app',
    [
        'checklist-model',
        'ngRoute',
        'ngResource',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ui.bootstrap.dropdown',
        'ui.bootstrap.collapse',
        'ui.bootstrap.tabs',
        'ui.bootstrap.transition',
        'ui.bootstrap.pagination',
        'leaflet-directive',
        'angularMoment',
        'btford.markdown',
        'posts',
        'tools',
        'user-profile',
        'workspace'
    ])

    .constant('CONST', {
        BACKEND_URL         : backendUrl,
        API_URL             : backendUrl + '/api/v2',
        DEFAULT_LOCALE      : 'en_US',
        OAUTH_CLIENT_ID     : 'ushahidiui',
        OAUTH_CLIENT_SECRET : '35e7f0bca957836d05ca0492211b0ac707671261'
    })

    .service('Authentication', require('./common/services/authentication.js'))
    .service('Session', require('./common/services/session.js'))
    .service('ConfigEndpoint', require('./services/endpoint/config.js'))
    .service('UserEndpoint', require('./common/services/endpoints/user-endpoint.js'))
    .service('FormEndpoint', require('./services/endpoint/form.js'))
    .service('FormAttributeEndpoint', require('./services/endpoint/form-attributes.js'))
    .service('TagEndpoint', require('./services/endpoint/tag.js'))
    .service('RoleHelper', require('./common/services/role-helper.js'))
    .service('Util', require('./common/services/util.js'))
    .service('Notify', require('./common/services/notify.js'))
    .service('multiTranslate', require('./common/services/multi-translate.js'))

    .controller('navigation', require('./controllers/navigation.js'))
    .controller('adminMapSettings', require('./controllers/admin/map-settings.js'))
    .controller('postFilters', require('./controllers/post-filters.js'))

    .config(require('./common/configs/authentication-interceptor.js'))
    .config(require('./common/configs/locale-config.js'))
    .config(require('./common/configs/ui-bootstrap-template-decorators.js'))
    .config(require('./routes'))

    .run(require('./common/global/event-handlers.js'))

    .factory('_', function() {
        return require('underscore/underscore');
    })
    .factory('URI', function() {
        return require('URIjs/src/URI.js');
    })
    ;
