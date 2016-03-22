module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/activity', {
        controller: require('./controllers/activity-controller.js'),
        templateUrl: 'templates/activity/activity.html',
        resolve: {
            features: ['Features', function (Features) {
                Features.loadFeatures();
                return Features;
            }]
        }
    });

}];
