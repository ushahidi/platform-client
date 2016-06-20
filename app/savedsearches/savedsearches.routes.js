module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    $routeProvider
    .when('/savedsearches/:id/:view?', {
        controller: require('./savedsearches-controller.js'),
        templateUrl: 'templates/sets/savedsearches/savedsearches.html',
        resolve: {
            savedSearch: ['$route', 'SavedSearchEndpoint', function ($route, SavedSearchEndpoint) {
                return SavedSearchEndpoint.get({id: $route.current.params.id}).$promise;
            }]
        }
    })
    ;
}];
