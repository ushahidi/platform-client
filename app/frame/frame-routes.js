module.exports = ['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            redirectTo: '/views/map'
        })
        .when('/timeline', {
            controller: require('./controllers/login-controller.js'),
            templateUrl: 'templates/activity/activity-timeline.html'
        })
        .when('/activity', {
            controller: require('./controllers/activity-controller.js'),
            templateUrl: 'templates/activity/activity.html'
        })
        .when('/settings', {
            controller: require('./controllers/setting-general-controller.js'),
            templateUrl: 'templates/settings/settings.html'
        })
        ;
}];
