module.exports = ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/users', {
            controller: require('./controllers/user-manager-controller.js'),
            templateUrl: 'templates/users/users.html'
        });
}];
