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
        .when('/register', {
            controller: require('./controllers/register-controller.js'),
            templateUrl: 'templates/register.html'
        });
}];
