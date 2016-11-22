module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/region', {
        controller: require('./region.controller.js'),
        templateUrl: 'templates/region/region.html'
    });
}];
