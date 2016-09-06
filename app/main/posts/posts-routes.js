module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/views/:view?', {
        controller: require('./views/post-views.controller.js'),
        templateUrl: 'templates/main/posts/views/main.html'
    })
    .when('/collections/:id/:view?', {
        controller: require('./collections/collections-controller.js'),
        templateUrl: 'templates/main/posts/collections/collections.html',
        resolve: {
            collection: ['$route', 'CollectionEndpoint', function ($route, CollectionEndpoint) {

                return CollectionEndpoint.get({collectionId: $route.current.params.id}).$promise;
            }]
        }
    })
    .when('/savedsearches/:id/:view?', {
        controller: require('./savedsearches/savedsearches-controller.js'),
        templateUrl: 'templates/main/posts/savedsearches/savedsearches.html',
        resolve: {
            savedSearch: ['$route', 'SavedSearchEndpoint', function ($route, SavedSearchEndpoint) {
                return SavedSearchEndpoint.get({id: $route.current.params.id}).$promise;
            }]
        }
    })
    .when('/posts/create/:id', {
        controller: require('./modify/post-create.controller.js'),
        templateUrl: 'templates/main/posts/modify/main.html'
    })
    .when('/posts/:id', {
        controller: require('./detail/post-detail.controller.js'),
        templateUrl: 'templates/main/posts/detail/detail.html',
        resolve: {
            post: ['$route', 'PostEndpoint', function ($route, PostEndpoint) {
                return PostEndpoint.get({ id: $route.current.params.id }).$promise;
            }]
        }
    })
    .when('/posts/:id/edit', {
        controller: require('./modify/post-edit.controller.js'),
        templateUrl: 'templates/main/posts/modify/main.html'
    });
}];
