module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/activity', {
        controller: require('./activity.controller.js'),
        template: require('./activity.html')
    });

}];
