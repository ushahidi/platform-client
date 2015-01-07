module.exports = ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/users', {
            controller: require('./controllers/user-manager-controller.js'),
            templateUrl: 'templates/users/users.html'
        })
        .when('/users/:id/profile', {
            controller: require('./controllers/user-profile-controller.js'),
            templateUrl: 'templates/users/profile.html'
        });
}];
