module.exports = ['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            redirectTo: '/views/map'
        })
        .when('/login', {
            controller: require('./controllers/login-controller.js'),
            templateUrl: 'templates/login.html'
        })
        .when('/forbidden', {
            controller: require('./controllers/forbidden-controller.js'),
            templateUrl: 'templates/forbidden.html'
        })
        .when('/map-settings', {
            controller: require('./controllers/admin/map-settings.js'),
            templateUrl: 'templates/admin/map-settings.html'
        });
}];
