module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    $routeProvider
    .when('/collections/:id/:view?', {
        controller: require('./collections-controller.js'),
        templateUrl: 'templates/sets/collections/collections.html',
        resolve: {
            collection: ['$route', 'CollectionEndpoint', function ($route, CollectionEndpoint) {
                return CollectionEndpoint.get({collectionId: $route.current.params.id}).$promise;
            }]
        }
    })
    ;
}];
