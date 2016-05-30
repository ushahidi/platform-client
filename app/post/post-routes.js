module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/views/:view?', {
        controller: require('./views/post-views.controller.js'),
        templateUrl: 'templates/posts/views/main.html'
    })
    .when('/posts/create', {
        controller: require('./controllers/post-create-controller.js'),
        templateUrl: 'templates/posts/modify.html'
    })
    .when('/posts/:id', {
        controller: require('./controllers/post-detail-controller.js'),
        templateUrl: 'templates/posts/detail.html',
        resolve: {
            post: ['$route', 'PostEndpoint', function ($route, PostEndpoint) {
                return PostEndpoint.get({ id: $route.current.params.id }).$promise;
            }]
        }
    })
    .when('/posts/:id/messages', {
        controller: require('./controllers/post-messages-controller.js'),
        templateUrl: 'templates/posts/post-messages.html',
        resolve: {
            post: ['$route', 'PostEndpoint', function ($route, PostEndpoint) {
                return PostEndpoint.get({ id: $route.current.params.id }).$promise;
            }]
        }
    })
    .when('/posts/:id/edit', {
        controller: require('./controllers/post-edit-controller.js'),
        templateUrl: 'templates/posts/modify/modify.html',
        resolve: {
            post: ['$route', 'PostEndpoint', function ($route, PostEndpoint) {
                return PostEndpoint.get({id: $route.current.params.id}).$promise;
            }]
        }
    });

}];
