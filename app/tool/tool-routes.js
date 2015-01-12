module.exports = [
    '$routeProvider',
function(
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/tools', {
        redirectTo: '/tools/settings'
    })
    .when('/tools/settings', {
        controller: require('./controllers/tool-settings-controller.js'),
        templateUrl: 'templates/tool/settings.html'
    })
    .when('/tools/appearance', {
        controller: require('./controllers/tool-appearance-controller.js'),
        templateUrl: 'templates/tool/todo.html'
        // templateUrl: 'templates/tool/appearance.html'
    })
    .when('/tools/plugins', {
        controller: require('./controllers/tool-plugins-controller.js'),
        templateUrl: 'templates/tool/todo.html'
        // templateUrl: 'templates/tool/plugins.html'
    })
    .when('/tools/forms', {
        controller: require('./controllers/tool-forms-controller.js'),
        templateUrl: 'templates/tool/todo.html'
        // templateUrl: 'templates/tool/forms.html'
    })
    .when('/tools/categories', {
        controller: require('./controllers/tool-categories-controller.js'),
        templateUrl: 'templates/tool/categories.html'
    })
    .when('/tools/views', {
        controller: require('./controllers/tool-views-controller.js'),
        templateUrl: 'templates/tool/todo.html'
        // templateUrl: 'templates/tool/views.html'
    })
    .when('/tools/users', {
        controller: require('./controllers/tool-users-controller.js'),
        templateUrl: 'templates/tool/users.html'
    })
    .when('/tools/users/create', {
        controller: require('./controllers/tool-users-create-controller.js'),
        templateUrl: 'templates/tool/users-edit.html'
    })
    .when('/tools/users/:id', {
        controller: require('./controllers/tool-users-edit-controller.js'),
        templateUrl: 'templates/tool/users-edit.html'
    })
    .when('/tools/roles', {
        controller: require('./controllers/tool-roles-controller.js'),
        templateUrl: 'templates/tool/todo.html'
        // templateUrl: 'templates/tool/roles.html'
    });

}];
