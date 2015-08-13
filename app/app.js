require('angular');
require('angular-route');
require('leaflet');
require('leaflet.markercluster');
require('leaflet.locatecontrol/src/L.Control.Locate');
require('angular-leaflet-directive');
require('angular-resource');
require('angular-translate');
require('angular-ui-bootstrap/ui-bootstrap-tpls');
require('angular-ui-bootstrap-datetimepicker');
require('angular-sanitize');
require('angular-filter');
require('angular-local-storage');
require('checklist-model/checklist-model');
require('angular-gravatar/build/md5');
require('angular-gravatar/build/angular-gravatar');
require('selection-model/dist/selection-model');
require('ngGeolocation/ngGeolocation');
require('ng-showdown/src/ng-showdown');
window.d3 = require('d3'); // Required for nvd3
require('./common/wrapper/nvd3-wrapper');
require('angular-nvd3/src/angular-nvd3');

// Load ushahidi modules
require('./common/common-module.js');
require('./post/post-module.js');
require('./setting/setting-module.js');
require('./set/set-module.js');
require('./user-profile/user-profile-module.js');

// this 'environment variable' will be set within the gulpfile
var backendUrl = process.env.BACKEND_URL || 'http://ushahidi-backend',
    apiUrl = window.apiUrl = backendUrl + '/api/v3',
    claimedAnonymousScopes = [
        'posts',
        'media',
        'forms',
        'api',
        'tags',
        'savedsearches',
        'sets',
        'users',
        'stats',
        'layers',
        'config',
        'messages'
    ];

angular.module('app',
    [
        'checklist-model',
        'ngRoute',
        'ngResource',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ui.bootstrap.pagination',
        'ui.bootstrap.datepicker',
        'ui.bootstrap.datetimepicker',
        'ui.gravatar',
        'leaflet-directive',
        'angular.filter',
        'showdown',
        'ngGeolocation',
        'nvd3',
        'selectionModel',
        'ushahidi.common',
        'ushahidi.posts',
        'ushahidi.tools',
        'ushahidi.sets',
        'ushahidi.user-profile'
    ])

    .constant('CONST', {
        BACKEND_URL         : backendUrl,
        API_URL             : apiUrl,
        DEFAULT_LOCALE      : 'en_US',
        OAUTH_CLIENT_ID     : 'ushahidiui',
        OAUTH_CLIENT_SECRET : '35e7f0bca957836d05ca0492211b0ac707671261',
        CLAIMED_ANONYMOUS_SCOPES : claimedAnonymousScopes,
        CLAIMED_USER_SCOPES : claimedAnonymousScopes.concat('dataproviders')
    })

    .factory('_', function () {
        return require('underscore/underscore');
    })
    .factory('d3', function () {
        return window.d3;
    })
    .factory('URI', function () {
        return require('URIjs/src/URI.js');
    })
    .factory('Leaflet', function () {
        return window.L;
    })
    .factory('BootstrapConfig', function () {
        return window.bootstrapConfig || {};
    })
    .run(function () {
        // Once bootstrapped, show the app
        angular.element(document.getElementById('bootstrap-app')).removeClass('hidden');
        angular.element(document.getElementById('bootstrap-loading')).addClass('hidden');
    })
    ;
