module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {


    $routeProvider
    .when('/users/me', {
        controller: require('./controllers/user-profile-controller.js'),
        templateUrl: 'templates/users/me.html',
        resolve: {
            user: ['UserEndpoint', function (UserEndpoint) {
                return UserEndpoint.get({id: 'me'}).$promise;
            }]
        }
    })
    .when('/users/me/notifications/', {
        controller: require('./controllers/notification-controller.js'),
        templateUrl: 'templates/notifications/notifications.html'
    })
    ;
}];
