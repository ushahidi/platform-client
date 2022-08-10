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
require('angular-cache');
require('angular-linkify');
require('ngtweet');
require('oclazyload');

// Make sure we have a window.ushahidi object
window.ushahidi = window.ushahidi || {};

// Load ushahidi modules
require('./mode-bar/mode-bar.module.js');
require('./map/map-module.js');
require('./common/common-module.js');
require('./auth/auth-module.js');
require('./data/data-routes.js');
require('./settings/settings.routes.js');
require('./activity/activity-routes.js');
import ravenModule from './common/raven/raven';
import * as UshahidiSdk from 'ushahidi-platform-sdk/build/src/index';

import { Chart, registerables } from 'chart.js';

// Change to https://gitlab.com/mmillerbkg/chartjs-adapter-dayjs/-/tree/master once moment is exchanged to dayjs
import 'chartjs-adapter-dayjs-3';

// Load platform-pattern-library CSS
require('ushahidi-platform-pattern-library/assets/css/style.min.css');
require('../sass/vendor.scss');

// this 'environment variable' will be set within the gulpfile
var backendUrl = (window.ushahidi.backendUrl = (
        window.ushahidi.backendUrl || BACKEND_URL
    ).replace(/\/$/, '')),
    intercomAppId = (window.ushahidi.intercomAppId =
        window.ushahidi.intercomAppId || ''),
    ushDisableChecks = window.ushahidi.ushDisableChecks || USH_DISABLE_CHECKS,
    verifier = (window.ushahidi.verifier =
        window.ushahidi.verifier || VERIFIER),
    appStoreId = (window.ushahidi.appStoreId =
        window.ushahidi.appStoreId || ''),
    apiUrl = (window.ushahidi.apiUrl = backendUrl + '/api/v3'),
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

angular
    .module('app', [
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
        'angular-cache',
        'linkify',
        ravenModule,
        'ushahidi.modebar',
        'ushahidi.map',
        'ushahidi.common',
        'ushahidi.auth',
        'ushahidi.data.routes',
        'ushahidi.settings.routes',
        'ushahidi.activity.routes',
        'ui.bootstrap.dropdown',
        'ngtweet',
        'oc.lazyLoad'
    ])

    .constant('CONST', {
        BACKEND_URL: backendUrl,
        API_URL: apiUrl,
        INTERCOM_APP_ID: intercomAppId,
        APP_STORE_ID: appStoreId,
        VERIFIER: verifier,
        DEFAULT_LOCALE: 'en_US',
        OAUTH_CLIENT_ID: 'ushahidiui',
        OAUTH_CLIENT_SECRET: '35e7f0bca957836d05ca0492211b0ac707671261',
        CLAIMED_ANONYMOUS_SCOPES: claimedAnonymousScopes,
        CLAIMED_USER_SCOPES: ['*'],
        MAPBOX_API_KEY:
            window.ushahidi.mapboxApiKey ||
            'pk.eyJ1IjoidXNoYWhpZGkiLCJhIjoiY2lxaXUzeHBvMDdndmZ0bmVmOWoyMzN6NiJ9.CX56ZmZJv0aUsxvH5huJBw', // Default OSS mapbox api key
        USH_DISABLE_CHECKS: ushDisableChecks,
        TOS_RELEASE_DATE: new Date(window.ushahidi.tosReleaseDate).toJSON()
            ? new Date(window.ushahidi.tosReleaseDate)
            : false, // Date in UTC
        EXPORT_POLLING_INTERVAL:
            window.ushahidi.export_polling_interval || 30000
    })
    .config([
        '$compileProvider',
        function ($compileProvider) {
            $compileProvider.debugInfoEnabled(false);
        }
    ])
    .config([
        '$locationProvider',
        function ($locationProvider) {
            $locationProvider.html5Mode(true).hashPrefix('!');
        }
    ])
    .config(function ($urlRouterProvider, $urlMatcherFactoryProvider) {
        $urlRouterProvider.when('', '/views/map');
        $urlRouterProvider.when('/', '/views/map');
        // if the path doesn't match any of the urls you configured
        // otherwise will take care of routing the user to the specified url
        $urlRouterProvider.otherwise('/404');
        $urlMatcherFactoryProvider.strictMode(false);
    })
    .config([
        '$ocLazyLoadProvider',
        function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({});
    }])
    .config([
        '$showdownProvider',
        function ($showdownProvider) {
            $showdownProvider.setOption('simplifiedAutoLink', true);
            $showdownProvider.setOption(
                'excludeTrailingPunctuationFromURLs',
                true
            );
            $showdownProvider.setOption('openLinksInNewWindow', true);
            $showdownProvider.setOption('tasklists', true);
            $showdownProvider.setOption('sanitize', true);
        }
    ])

    .factory('_', function () {
        return require('underscore/underscore');
    })
    .factory('Chart', function () {
        Chart.register(...registerables);
        return Chart;
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
    .factory('dayjs', function () {
        return require('dayjs');
    })
    .factory('relativeTime', function () {
        return require('dayjs/plugin/relativeTime');
    })
    .factory('localizedFormat', function () {
        return require('dayjs/plugin/localizedFormat');
    })
    .factory('utc', function () {
        return require('dayjs/plugin/utc');
    })
    .factory('isSameOrBefore', function () {
        return require('dayjs/plugin/isSameOrBefore');
    })
    .factory('BootstrapConfig', [
        '_',
        function (_) {
            return window.ushahidi.bootstrapConfig
                ? _.indexBy(window.ushahidi.bootstrapConfig, 'id')
                : { map: {}, site: {}, features: {} };
        }
    ])
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
    .factory('UnifiedScopeForShowingLockInMetadata', function() {
        let data = {};

        return {
             getPostFromPostCard: function () {
                return data;
            },
            setPostForShowingLockInAnyView: function (post) {
                data = post;
            }
        };
    })
    .run([
        '$rootScope',
        'LoadingProgress',
        '$transitions',
        '$uiRouter',
        function ($rootScope, LoadingProgress, $transitions, $uiRouter) {
            // this handles the loading-state app-wide
            LoadingProgress.watchTransitions();
            if (window.ushahidi.gaEnabled && window.ga) {
                $transitions.onSuccess({}, function (transition) {
                    window.ga('send', 'pageview', $uiRouter.urlRouter.location);
                });
            }
        }
    ])
    .run([function () {
            angular
                .element(document.getElementById('bootstrap-app'))
                .removeClass('hidden');
            angular
                .element(document.getElementById('bootstrap-loading'))
                .addClass('hidden');
        }
    ])
    .run([
        'VerifierService',
        function (VerifierService) {
            VerifierService.debugModeCheck();
        }
    ])
    .run(['$rootScope',function ($rootScope) {
        let event = new CustomEvent('newTitle', { title: '' });
        $rootScope.$on('setPageTitle', function (ev, title) {
            // Sending the page-title to the newTitle-event to be consumed by root-application
            event.title = title;
            window.dispatchEvent(event);
        });
    }])
    .run(['$http', function($http) {
        $http.get('https://github.ushahidi.org/platform-pattern-library/assets/img/iconic-sprite.svg').then(function(response) {
            console.log('RESPONSE: ', response);
            var div = document.createElement('div');
            div.innerHTML = response.data;
            div.setAttribute('style', 'position: absolute; z-index: -1');
            document.body.insertBefore(div, document.body.childNodes[0]);
        });
    }]);
    // .run(require('./gtm-userprops.js'));
