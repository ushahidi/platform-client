module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/views/map', {
        controller: require('./controllers/views/post-map-view-controller.js'),
        templateUrl: 'templates/views/map.html'
    })
    .when('/views/list', {
        controller: require('./controllers/views/post-list-view-controller.js'),
        templateUrl: 'templates/views/list.html'
    })
    .when('/views/graph', {
        controller: require('./controllers/views/post-graph-view-controller.js'),
        templateUrl: 'templates/views/graph.html'
    })
    .when('/views/timeline', {
        controller: require('./controllers/views/post-timeline-view-controller.js'),
        templateUrl: 'templates/views/timeline.html'
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
