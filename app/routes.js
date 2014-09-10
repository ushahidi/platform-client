var fs = require('fs');

module.exports = function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            controller: require('./controllers/posts.js'),
            templateUrl: 'templates/posts.html'
        })
        .when('/posts/detail', {
            controller: require('./controllers/posts/detail.js'),
            templateUrl: 'templates/posts/detail.html'
        })
        .when('/posts/add-to-set', {
            controller: require('./controllers/sets/add-to-set.js'),
            template: fs.readFileSync(__dirname + '/templates/sets/add-to-set.html')
        })
        .when('/settings', {
            controller: require('./controllers/admin/settings.js'),
            templateUrl: 'templates/admin/settings.html'
        });
};
