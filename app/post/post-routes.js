module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {

    $routeProvider
    .when('/views/:view?', {
        controller: require('./controllers/post-views-controller.js'),
        templateUrl: 'templates/posts/views.html'
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
