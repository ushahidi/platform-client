module.exports = [
    '$routeProvider',
function(
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/workspace', {
        controller: require('./controllers/workspace-dashboard-controller.js'),
        templateUrl: 'templates/workspace/dashboard.html'
    })
    .when('/workspace/posts', {
        controller: require('./controllers/workspace-posts-controller.js'),
        templateUrl: 'templates/workspace/posts.html'
    })
    .when('/workspace/comments', {
        controller: require('./controllers/workspace-comments-controller.js'),
        templateUrl: 'templates/workspace/comments.html'
    });

}];
