var fs = require('fs');

module.exports = function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    var postRouteConfig = {
      controller: require('./controllers/posts.js'),
      templateUrl: 'templates/posts.html'
    };
    $routeProvider
        .when('/', postRouteConfig)
        .when('/posts', postRouteConfig)
        .when('/posts/detail', {
            controller: require('./controllers/posts/detail.js'),
            templateUrl: 'templates/posts/detail.html'
        })
        .when('/posts/add-to-set', {
            controller: require('./controllers/sets/add-to-set.js'),
            templateUrl: 'templates/sets/add-to-set.html'
        })
        .when('/settings', {
            controller: require('./controllers/admin/settings.js'),
            templateUrl: 'templates/admin/settings.html'
        });
};
