require('angular');
require('angular-route');
require('leaflet');
require('leaflet.markercluster');
require('leaflet.locatecontrol/src/L.Control.Locate');
require('angular-leaflet-directive');
require('angular-resource');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-ui-bootstrap/ui-bootstrap-tpls');
require('angular-datepicker');
require('moment-timezone');
require('angular-sanitize');
require('angular-filter');
require('angular-local-storage');
require('checklist-model/checklist-model');
require('selection-model/dist/selection-model');
require('ngGeolocation/ngGeolocation');
require('ng-showdown/src/ng-showdown');
window.d3 = require('d3'); // Required for nvd3
window.dc = require('dc'); // Required for charting used in activity page
require('./common/wrapper/nvd3-wrapper');
require('angular-nvd3/src/angular-nvd3');
require('angular-cache');

// Load ushahidi modules
require('./common/common-module.js');
require('./post/post-module.js');
require('./activity/activity-module.js');
require('./setting/setting-module.js');
require('./set/set-module.js');
require('./user-profile/user-profile-module.js');

// Make sure we have a window.ushahidi object
window.ushahidi = window.ushahidi || {};

// this 'environment variable' will be set within the gulpfile
var backendUrl = window.ushahidi.backendUrl = window.ushahidi.backendUrl || process.env.BACKEND_URL || 'http://ushahidi-backend',
    apiUrl = window.ushahidi.apiUrl = backendUrl + '/api/v3',
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
        'messages',
        'notifications',
        'contacts'
    ];

angular.module('app',
    [
        'checklist-model',
        'ngRoute',
        'ngResource',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ui.bootstrap.pagination',
        'datePicker',
        'leaflet-directive',
        'angular.filter',
        'showdown',
        'ngGeolocation',
        'nvd3',
        'selectionModel',
        'angular-cache',
        'ushahidi.common',
        'ushahidi.posts',
        'ushahidi.tools',
        'ushahidi.sets',
        'ushahidi.activity',
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

    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])

    .factory('_', function () {
        return require('underscore/underscore');
    })
    .factory('d3', function () {
        return window.d3;
    })
    .factory('dc', function () {
        return window.dc;
    })
    .factory('URI', function () {
        return require('URIjs/src/URI.js');
    })
    .factory('Leaflet', function () {
        return window.L;
    })
    .factory('BootstrapConfig', function () {
        return window.ushahidi.bootstrapConfig || {};
    })
    .run(function () {
        // Once bootstrapped, show the app
        angular.element(document.getElementById('bootstrap-app')).removeClass('hidden');
        angular.element(document.getElementById('bootstrap-loading')).addClass('hidden');
    })
    ;
