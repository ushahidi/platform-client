module.exports = ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/users/:id/profile', {
            controller: require('./controllers/user-profile-controller.js'),
            templateUrl: 'templates/users/profile.html'
        })
        ;
}];
