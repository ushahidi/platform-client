module.exports = ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            redirectTo: '/views/map'
        })
        .when('/login', {
            controller: require('./controllers/login.js'),
            templateUrl: 'templates/login.html'
        })
        .when('/posts/add-to-set', {
            controller: require('./controllers/sets/add-to-set.js'),
            templateUrl: 'templates/sets/add-to-set.html'
        })
        .when('/map-settings', {
            controller: require('./controllers/admin/map-settings.js'),
            templateUrl: 'templates/admin/map-settings.html'
        });
}];
