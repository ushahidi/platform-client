module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/activity', {
        controller: require('./activity.controller.js'),
        templateUrl: 'templates/main/activity/activity.html'
    });

}];
