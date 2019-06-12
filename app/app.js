<<<<<<< HEAD
// Migration React / Redux imports
/* eslint-disable */
import thunk from "redux-thunk";
import RootReducer from "./rootReducer";

require("angular");
require("@uirouter/angularjs");
require("angular-resource");
require("angular-translate");
require("angular-translate-loader-static-files");
require("angular-ui-bootstrap");
require("angular-datepicker/build/angular-datepicker");
require("angular-sanitize");
require("angular-elastic");
require("angular-filter");
require("angular-local-storage");
require("checklist-model");
require("ngGeolocation/ngGeolocation");
require("ng-showdown");
window.d3 = require("d3"); // Required for nvd3
require("./common/wrapper/nvd3-wrapper");
require("angular-nvd3/src/angular-nvd3");
require("angular-cache");
require("angular-linkify");
require("ng-redux");

// Load ushahidi modules
require("./common/common-module.js");
require("./main/main-module.js");
require("./settings/settings.module.js");
=======
require('angular');
require('@uirouter/angularjs');
require('angular-resource');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-ui-bootstrap');
require('angular-datepicker/build/angular-datepicker');
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
>>>>>>> 2c30357b72fd2cae08459753ed104a3bc15a8b68

// Load platform-pattern-library CSS
require("ushahidi-platform-pattern-library/assets/fonts/Lato/css/fonts.css");
require("ushahidi-platform-pattern-library/assets/css/style.min.css");
require("../sass/vendor.scss");

<<<<<<< HEAD
// Stub ngRaven module incase its not configured
angular.module("ngRaven", []);

=======
>>>>>>> 2c30357b72fd2cae08459753ed104a3bc15a8b68
// Make sure we have a window.ushahidi object
window.ushahidi = window.ushahidi || {};

// this 'environment variable' will be set within the gulpfile
<<<<<<< HEAD
let backendUrl = (window.ushahidi.backendUrl = (
        window.ushahidi.backendUrl || BACKEND_URL
    ).replace(/\/$/, "")),
    intercomAppId = (window.ushahidi.intercomAppId =
        window.ushahidi.intercomAppId || ""),
    appStoreId = (window.ushahidi.appStoreId =
        window.ushahidi.appStoreId || ""),
    apiUrl = (window.ushahidi.apiUrl = `${backendUrl}/api/v3`),
    platform_websocket_redis_adapter_url =
        window.ushahidi.platform_websocket_redis_adapter_url || "",
=======
var backendUrl = window.ushahidi.backendUrl = (window.ushahidi.backendUrl || BACKEND_URL).replace(/\/$/, ''),
    intercomAppId = window.ushahidi.intercomAppId = window.ushahidi.intercomAppId || '',
    appStoreId = window.ushahidi.appStoreId = window.ushahidi.appStoreId || '',
    apiUrl = window.ushahidi.apiUrl = backendUrl + '/api/v3',
>>>>>>> 2c30357b72fd2cae08459753ed104a3bc15a8b68
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

<<<<<<< HEAD
angular
    .module("app", [
        "checklist-model",
        "monospaced.elastic",
        "ui.router",
        "ngResource",
        "LocalStorageModule",
        "pascalprecht.translate",
        "ui.bootstrap.pagination",
        "angular-datepicker",
        "angular.filter",
        "ng-showdown",
        "ngGeolocation",
        "nvd3",
        "angular-cache",
        "linkify",
        "ngRaven",
        "ushahidi.common",
        "ushahidi.main",
        "ushahidi.settings",
        "ui.bootstrap.dropdown",
        "ngRedux"
=======
angular.module('app',
    [
        'checklist-model',
        'monospaced.elastic',
        'ui.router',
        'ngResource',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ui.bootstrap.pagination',
        'angular-datepicker',
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
>>>>>>> 2c30357b72fd2cae08459753ed104a3bc15a8b68
    ])
    .constant('CONST', {
        BACKEND_URL              : backendUrl,
        API_URL                  : apiUrl,
        INTERCOM_APP_ID          : intercomAppId,
        APP_STORE_ID             : appStoreId,
        DEFAULT_LOCALE           : 'en_US',
        OAUTH_CLIENT_ID          : 'ushahidiui',
        OAUTH_CLIENT_SECRET      : '35e7f0bca957836d05ca0492211b0ac707671261',
        CLAIMED_ANONYMOUS_SCOPES : claimedAnonymousScopes,
        CLAIMED_USER_SCOPES      : ['*'],
        MAPBOX_API_KEY           : window.ushahidi.mapboxApiKey || 'pk.eyJ1IjoidXNoYWhpZGkiLCJhIjoiY2lxaXUzeHBvMDdndmZ0bmVmOWoyMzN6NiJ9.CX56ZmZJv0aUsxvH5huJBw', // Default OSS mapbox api key
        TOS_RELEASE_DATE         : new Date(window.ushahidi.tosReleaseDate).toJSON() ? new Date(window.ushahidi.tosReleaseDate) : false, // Date in UTC
        EXPORT_POLLING_INTERVAL  : window.ushahidi.export_polling_interval || 30000
    })
    .config([
        "$compileProvider",
        function($compileProvider) {
            $compileProvider.debugInfoEnabled(false);
        }
    ])
    .config([
        "$locationProvider",
        function($locationProvider) {
            $locationProvider.html5Mode(true).hashPrefix("!");
        }
    ])
    .config(($urlRouterProvider, $urlMatcherFactoryProvider) => {
        $urlRouterProvider.when("", "/views/map");
        $urlRouterProvider.when("/", "/views/map");
        // if the path doesn't match any of the urls you configured
        // otherwise will take care of routing the user to the specified url
        $urlRouterProvider.otherwise("/404");
        $urlMatcherFactoryProvider.strictMode(false);
    })
    .config([
        "$showdownProvider",
        function($showdownProvider) {
            $showdownProvider.setOption("simplifiedAutoLink", true);
            $showdownProvider.setOption(
                "excludeTrailingPunctuationFromURLs",
                true
            );
            $showdownProvider.setOption("openLinksInNewWindow", true);
            $showdownProvider.setOption("tasklists", true);
            $showdownProvider.setOption("sanitize", true);
        }
    ])

    .factory("_", () => require("underscore/underscore"))
    .factory("d3", () => window.d3)
    .factory("URI", () => require("URIjs/src/URI.js"))
    .factory("Leaflet", () => {
        const L = require("leaflet");
        // Load leaflet plugins here too
        require("imports-loader?L=leaflet!leaflet.markercluster");
        require("imports-loader?L=leaflet!leaflet.locatecontrol/src/L.Control.Locate");
        return L;
    })
<<<<<<< HEAD
    .factory("moment", () => require("moment"))
    .factory("io", () => require("socket.io-client"))
    .factory("BootstrapConfig", [
        "_",
        function(_) {
            return window.ushahidi.bootstrapConfig
                ? _.indexBy(window.ushahidi.bootstrapConfig, "id")
                : { map: {}, site: {}, features: {} };
        }
    ])
    .factory("Sortable", () => require("sortablejs"))
=======
    .factory('moment', function () {
        return require('moment');
    })
    .factory('BootstrapConfig', ['_', function (_) {
        return window.ushahidi.bootstrapConfig ?
            _.indexBy(window.ushahidi.bootstrapConfig, 'id') :
            { map: {}, site: {}, features: {} };
    }])
    .factory('Sortable', function () {
        return require('sortablejs');
    })
>>>>>>> 2c30357b72fd2cae08459753ed104a3bc15a8b68
    // inject the router instance into a `run` block by name
    // .run(['$uiRouter', '$trace', '$location', function ($uiRouter, $trace, $location) {
    //     // * uncomment this to enable the visualizer *
    //     let Visualizer = require('@uirouter/visualizer').Visualizer;
    //     let pluginInstance = $uiRouter.plugin(Visualizer);
    //     $trace.enable('TRANSITION');
    // }])
<<<<<<< HEAD
    .run([
        "$rootScope",
        "LoadingProgress",
        "$transitions",
        function($rootScope, LoadingProgress, $transitions) {
            // this handles the loading-state app-wide
            LoadingProgress.watchTransitions();
            if (window.ushahidi.gaEnabled) {
                $transitions.onSuccess({}, transition => {
                    window.ga("send", "pageview", transition.to().url);
                });
            }
        }
    ])
    .run(() => {
        angular
            .element(document.getElementById("bootstrap-app"))
            .removeClass("hidden");
        angular
            .element(document.getElementById("bootstrap-loading"))
            .addClass("hidden");
    })
    .config($ngReduxProvider => {
        $ngReduxProvider.createStoreWith(
            RootReducer,
            [thunk],
            window.__REDUX_DEVTOOLS_EXTENSION__
	            ? [window.__REDUX_DEVTOOLS_EXTENSION__()]
	            : null
        );
    });
/* eslint-enable */
=======
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
    }]);
>>>>>>> 2c30357b72fd2cae08459753ed104a3bc15a8b68
