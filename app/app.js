require('angular');
require('@uirouter/angularjs');
require('angular-resource');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-ui-bootstrap');
require('angular-sanitize');
require('angular-elastic');
require('angular-filter');
require('angular-local-storage');
require('checklist-model');
require('ngGeolocation/ngGeolocation');
require('ng-showdown');
window.d3 = require('d3'); // Required for nvd3
require('./common/wrapper/nvd3-wrapper');
require('angular-nvd3/src/angular-nvd3');
require('angular-cache');
require('angular-linkify');
require('ngtweet');

// Load ushahidi modules
require('./common/common-module.js');
require('./main/main-module.js');
require('./settings/settings.module.js');
import ravenModule from './common/raven/raven';
import * as UshahidiSdk from 'ushahidi-platform-sdk/build/src/index';
// Load platform-pattern-library CSS
require('ushahidi-platform-pattern-library/assets/fonts/Lato/css/fonts.css');
require('ushahidi-platform-pattern-library/assets/css/style.min.css');
require('../sass/vendor.scss');

// Make sure we have a window.ushahidi object
window.ushahidi = window.ushahidi || {};

// this 'environment variable' will be set within the gulpfile
var backendUrl = window.ushahidi.backendUrl = (window.ushahidi.backendUrl || BACKEND_URL).replace(/\/$/, ''),
    intercomAppId = window.ushahidi.intercomAppId = window.ushahidi.intercomAppId || '',
    ushDisableChecks = (window.ushahidi.ushDisableChecks || USH_DISABLE_CHECKS),
    verifier = window.ushahidi.verifier = (window.ushahidi.verifier || VERIFIER),
    appStoreId = window.ushahidi.appStoreId = window.ushahidi.appStoreId || '',
    apiUrl = window.ushahidi.apiUrl = backendUrl + '/api/v3',
    claimedAnonymousScopes = [
        'posts',
        'country_codes',
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
        'webhooks',
        'contacts',
        'roles',
        'permissions',
        'csv'
    ];

angular.module('app',
    [
        'checklist-model',
        'monospaced.elastic',
        'ui.router',
        'ngResource',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ui.bootstrap.pagination',
        'angular.filter',
        'ng-showdown',
        'ngGeolocation',
        'nvd3',
        'angular-cache',
        'linkify',
        ravenModule,
        'ushahidi.common',
        'ushahidi.main',
        'ushahidi.settings',
        'ui.bootstrap.dropdown',
        'ngtweet'
        ])

    .constant('CONST', {
        BACKEND_URL              : backendUrl,
        API_URL                  : apiUrl,
        INTERCOM_APP_ID          : intercomAppId,
        APP_STORE_ID             : appStoreId,
        VERIFIER                 : verifier,
        DEFAULT_LOCALE           : 'en_US',
        OAUTH_CLIENT_ID          : 'ushahidiui',
        OAUTH_CLIENT_SECRET      : '35e7f0bca957836d05ca0492211b0ac707671261',
        CLAIMED_ANONYMOUS_SCOPES : claimedAnonymousScopes,
        CLAIMED_USER_SCOPES      : ['*'],
        MAPBOX_API_KEY           : window.ushahidi.mapboxApiKey || 'pk.eyJ1IjoidXNoYWhpZGkiLCJhIjoiY2lxaXUzeHBvMDdndmZ0bmVmOWoyMzN6NiJ9.CX56ZmZJv0aUsxvH5huJBw', // Default OSS mapbox api key
        USH_DISABLE_CHECKS       : ushDisableChecks,
        TOS_RELEASE_DATE         : new Date(window.ushahidi.tosReleaseDate).toJSON() ? new Date(window.ushahidi.tosReleaseDate) : false, // Date in UTC
        EXPORT_POLLING_INTERVAL  : window.ushahidi.export_polling_interval || 30000
    })
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    }])
    .config(function ($urlRouterProvider, $urlMatcherFactoryProvider) {
        $urlRouterProvider.when('', '/views/map');
        $urlRouterProvider.when('/', '/views/map');
        // if the path doesn't match any of the urls you configured
        // otherwise will take care of routing the user to the specified url
        $urlRouterProvider.otherwise('/404');
        $urlMatcherFactoryProvider.strictMode(false);
    })
    .config(['$showdownProvider', function ($showdownProvider) {
        $showdownProvider.setOption('simplifiedAutoLink', true);
        $showdownProvider.setOption('excludeTrailingPunctuationFromURLs', true);
        $showdownProvider.setOption('openLinksInNewWindow', true);
        $showdownProvider.setOption('tasklists', true);
        $showdownProvider.setOption('sanitize', true);
    }])

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
        var L = require('leaflet');
        // Load leaflet plugins here too
        require('imports-loader?L=leaflet!leaflet.markercluster');
        require('imports-loader?L=leaflet!leaflet.locatecontrol/src/L.Control.Locate');
        require('imports-loader?L=leaflet!leaflet-easybutton');
        return L;
    })
    .factory('moment', function () {
        return require('moment');
    })
    .factory('BootstrapConfig', ['_', function (_) {
        return window.ushahidi.bootstrapConfig ?
            _.indexBy(window.ushahidi.bootstrapConfig, 'id') :
            { map: {}, site: {}, features: {} };
    }])
    .factory('Sortable', function () {
        return require('sortablejs/Sortable');
    })
    .factory('Editor', function () {
        return require('@toast-ui/editor');
    })
    .factory('Flatpickr', function () {
        return require('flatpickr').default;
    })
    .factory('UshahidiSdk', function () {
        return UshahidiSdk;
    })
    .factory('FocusTrap', function () {
        return require('focus-trap');
    })
    .factory('Chartist', function () {
        return require('chartist');
    })
    .factory('frappe', function () {
        return require('frappe-charts/dist/frappe-charts.min.cjs');
    })
    .run(['$rootScope', 'LoadingProgress', '$transitions', '$uiRouter', function ($rootScope, LoadingProgress, $transitions, $uiRouter) {
        // this handles the loading-state app-wide
        LoadingProgress.watchTransitions();
        if (window.ushahidi.gaEnabled) {
            $transitions.onSuccess({}, function (transition) {
                window.ga('send', 'pageview',  $uiRouter.urlRouter.location);
            });
        }
    }])
    .run(['DemoDeploymentService', function (DemoDeploymentService) {
        angular.element(document.getElementById('bootstrap-app')).removeClass('hidden');
        angular.element(document.getElementById('bootstrap-loading')).addClass('hidden');
        DemoDeploymentService.demoCheck();
    }])
    .run(['VerifierService', function (VerifierService) {
        VerifierService.debugModeCheck();
    }]);
