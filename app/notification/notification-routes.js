module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    $routeProvider
    .when('/users/me/notifications/', {
        controller: require('./controllers/notification-controller.js'),
        templateUrl: 'templates/notifications/notifications.html',
        resolve: {
            notifications: ['$route', 'NotificationEndpoint', function ($route, NotificationEndpoint) {
                return NotificationEndpoint.get().$promise;
            }]
        }
    });
}];
