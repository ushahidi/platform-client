module.exports = function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    var postListRouteConfig = {
      controller: require('./controllers/post-list-view.js'),
      templateUrl: 'templates/post-list-view.html'
    };
    $routeProvider
        .when('/', postListRouteConfig)
        .when('/views/list', postListRouteConfig)
        .when('/signin', {
            controller: require('./controllers/signin.js'),
            templateUrl: 'templates/signin.html'
        })
        .when('/views/map', {
            controller: require('./controllers/post-map-view.js'),
            templateUrl: 'templates/post-map-view.html'
        })
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
        })
        .when('/map-settings', {
            controller: require('./controllers/admin/map-settings.js'),
            templateUrl: 'templates/admin/map-settings.html'
        })
        .when('/users', {
            controller: require('./controllers/users/users.js'),
            templateUrl: 'templates/users/users.html'
        })
        .when('/tags', {
            controller: require('./controllers/tags/tags.js'),
            templateUrl: 'templates/tags/tags.html'
        });
};
