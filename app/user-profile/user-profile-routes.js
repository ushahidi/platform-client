module.exports = [
    '$routeProvider',
function(
    $routeProvider
) {


    $routeProvider
    .when('/users/me', {
        controller: require('./controllers/user-profile-controller.js'),
        templateUrl: 'templates/users/profile.html'
    });
}];
