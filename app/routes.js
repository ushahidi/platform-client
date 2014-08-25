var fs = require('fs');

module.exports = function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            controller: require('./controllers/posts.js'),
            template: fs.readFileSync(__dirname + '/templates/posts.html')
        })
        .when('/posts/detail', {
            controller: require('./controllers/posts/detail.js'),
            template: fs.readFileSync(__dirname + '/templates/posts/detail.html')
        })
        .when('/settings', {
            controller: require('./controllers/admin/settings.js'),
            template: fs.readFileSync(__dirname + '/templates/admin/settings.html')
        });
};
