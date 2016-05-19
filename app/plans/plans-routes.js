module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/settings/plan', {
        controller: require('./controllers/setting-plan-controller.js'),
        templateUrl: 'templates/settings/plan/plan.html'
    })
    ;

}];
