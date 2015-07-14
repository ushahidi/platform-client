module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    $routeProvider
    .when('/collections/:id/:view?', {
        controller: require('./controllers/collections-controller.js'),
        templateUrl: 'templates/sets/collections.html',
        resolve: {
            collection: ['$route', 'CollectionEndpoint', function ($route, CollectionEndpoint) {

                return CollectionEndpoint.get({id: $route.current.params.id}).$promise;
            }]
        }
    })
    .when('/savedsearches/:id/:view?', {
        controller: require('./controllers/savedsearches-controller.js'),
        templateUrl: 'templates/sets/savedsearches.html',
        resolve: {
            savedsearch: ['$route', 'SavedSearchEndpoint', function ($route, SavedSearchEndpoint) {
                return SavedSearchEndpoint.get({id: $route.current.params.id}).$promise;
            }]
        }
    })
    ;
}];
