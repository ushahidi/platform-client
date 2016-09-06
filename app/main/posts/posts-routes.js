module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/views/:view?', {
        controller: require('./views/post-views.controller.js'),
        template: require('./views/main.html')
    })
    .when('/collections/:id/:view?', {
        controller: require('./collections/collections-controller.js'),
        template: require('./collections/collections.html'),
        resolve: {
            collection: ['$route', 'CollectionEndpoint', function ($route, CollectionEndpoint) {

                return CollectionEndpoint.get({collectionId: $route.current.params.id}).$promise;
            }]
        }
    })
    .when('/savedsearches/:id/:view?', {
        controller: require('./savedsearches/savedsearches-controller.js'),
        template: require('./savedsearches/savedsearches.html'),
        resolve: {
            savedSearch: ['$route', 'SavedSearchEndpoint', function ($route, SavedSearchEndpoint) {
                return SavedSearchEndpoint.get({id: $route.current.params.id}).$promise;
            }]
        }
    })
    .when('/posts/create/:id', {
        controller: require('./modify/post-create.controller.js'),
        template: require('./modify/main.html')
    })
    .when('/posts/:id', {
        controller: require('./detail/post-detail.controller.js'),
        template: require('./detail/detail.html'),
        resolve: {
            post: ['$route', 'PostEndpoint', function ($route, PostEndpoint) {
                return PostEndpoint.get({ id: $route.current.params.id }).$promise;
            }]
        }
    })
    .when('/posts/:id/edit', {
        controller: require('./modify/post-edit.controller.js'),
        template: require('./modify/main.html')
    });
}];
