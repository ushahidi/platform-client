module.exports = ['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            redirectTo: '/views/map'
        })
        .when('/login', {
            controller: require('./auth/login.controller.js'),
            template: ''
        })
        .when('/forbidden', {
            controller: require('./auth/forbidden.controller.js'),
            templateUrl: 'templates/auth/forbidden.html'
        })
        .when('/register', {
            controller: require('./auth/register.controller.js'),
            template: ''
        })
        .when('/forgotpassword', {
            controller: require('./auth/password-reset.controller.js'),
            template: ''
        })
        .when('/forgotpassword/confirm', {
            controller: require('./auth/password-reset-confirm.controller.js'),
            template: ''
        })
        .when('/forgotpassword/confirm/:token*', {
            controller: require('./auth/password-reset-confirm.controller.js'),
            template: ''
        })
        ;
}];
