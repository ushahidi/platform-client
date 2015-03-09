module.exports = [
    '$routeProvider',
function(
    $routeProvider
) {

    $routeProvider
    .when('/views/map', {
        controller: require('./controllers/post-map-view-controller.js'),
        templateUrl: 'templates/post-map-view.html'
    })
    .when('/views/list', {
        controller: require('./controllers/post-list-view-controller.js'),
        templateUrl: 'templates/post-list-view.html'
    })
    .when('/posts/create', {
        controller: require('./controllers/post-create-controller.js'),
        templateUrl: 'templates/posts/modify.html'
    })
    .when('/posts/:id', {
        controller: require('./controllers/post-detail-controller.js'),
        templateUrl: 'templates/posts/detail.html'
    })
    .when('/posts/:id/edit', {
        controller: require('./controllers/post-edit-controller.js'),
        templateUrl: 'templates/posts/modify.html'
    });

}];
