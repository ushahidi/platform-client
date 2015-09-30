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
        })
        .when('/forgotpassword', {
            controller: require('./controllers/password-reset-controller.js'),
            templateUrl: 'templates/password-reset.html'
        })
        .when('/forgotpassword/confirm', {
            controller: require('./controllers/password-reset-confirm-controller.js'),
            templateUrl: 'templates/password-reset-confirm.html'
        })
        .when('/forgotpassword/confirm/:token*', {
            controller: require('./controllers/password-reset-confirm-controller.js'),
            templateUrl: 'templates/password-reset-confirm.html'
        })
        ;
}];
