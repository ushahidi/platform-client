module.exports = ['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            redirectTo: '/views/map'
        })
        .when('/login', {
            controller: require('./controllers/auth/login.controller.js'),
            template: ''
        })
        .when('/forbidden', {
            controller: require('./auth/forbidden.controller.js'),
            templateUrl: 'templates/auth/forbidden.html'
        })
        .when('/register', {
            controller: require('./auth/register.controller.js'),
            templateUrl: 'templates/auth/register.html'
        })
        .when('/forgotpassword', {
            controller: require('./auth/password-reset.controller.js'),
            templateUrl: 'templates/auth/password-reset.html'
        })
        .when('/forgotpassword/confirm', {
            controller: require('./auth/password-reset-confirm.controller.js'),
            templateUrl: 'templates/auth/password-reset-confirm.html'
        })
        .when('/forgotpassword/confirm/:token*', {
            controller: require('./auth/password-reset-confirm.controller.js'),
            templateUrl: 'templates/auth/password-reset-confirm.html'
        })
        ;
}];
