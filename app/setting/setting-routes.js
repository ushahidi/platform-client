module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/settings', {
        redirectTo: '/settings/general'
    })
    .when('/settings/general', {
        controller: require('./controllers/setting-general-controller.js'),
        templateUrl: 'templates/settings/settings.html'
    })
    .when('/settings/map-settings', {
        controller: require('./controllers/setting-map-settings.js'),
        templateUrl: 'templates/settings/map-settings.html'
    })
    .when('/settings/plugins', {
        controller: require('./controllers/setting-plugins-controller.js'),
        templateUrl: 'templates/settings/todo.html'
    })
    .when('/settings/forms', {
        controller: require('./controllers/setting-forms-controller.js'),
        templateUrl: 'templates/settings/forms/forms.html'
    })
    .when('/settings/forms/create', {
        controller: require('./controllers/setting-forms-create-controller.js'),
        templateUrl: 'templates/settings/forms/forms-create.html'
    })
    .when('/settings/forms/create/:id', {
        controller: require('./controllers/setting-forms-create-template-controller.js'),
        templateUrl: 'templates/settings/forms/forms-create-template.html'
    })
    .when('/settings/forms/:id', {
        controller: require('./controllers/setting-forms-edit-controller.js'),
        templateUrl: 'templates/settings/forms/forms-edit.html'
    })
    .when('/settings/forms/:formId/stages/:id', {
        controller: require('./controllers/setting-forms-edit-stage-controller.js'),
        templateUrl: 'templates/settings/forms/forms-edit-stage.html'
    })
    .when('/settings/categories', {
        controller: require('./controllers/setting-categories-controller.js'),
        templateUrl: 'templates/settings/categories.html'
    })
    .when('/settings/categories/create', {
        controller: require('./controllers/setting-categories-create-controller.js'),
        templateUrl: 'templates/settings/categories-edit.html'
    })
    .when('/settings/categories/:id', {
        controller: require('./controllers/setting-categories-edit-controller.js'),
        templateUrl: 'templates/settings/categories-edit.html'
    })
    .when('/settings/views', {
        controller: require('./controllers/setting-views-controller.js'),
        templateUrl: 'templates/settings/todo.html'
    })
    .when('/settings/users', {
        controller: require('./controllers/setting-users-controller.js'),
        templateUrl: 'templates/settings/users.html'
    })
    .when('/settings/users/create', {
        controller: require('./controllers/setting-users-create-controller.js'),
        templateUrl: 'templates/settings/users-edit.html'
    })
    .when('/settings/users/:id', {
        controller: require('./controllers/setting-users-edit-controller.js'),
        templateUrl: 'templates/settings/users-edit.html'
    })
    .when('/settings/roles', {
        controller: require('./controllers/setting-roles-controller.js'),
        templateUrl: 'templates/settings/todo.html'
    })
    .when('/settings/datasources', {
        controller: require('./controllers/setting-datasources-controller.js'),
        templateUrl: 'templates/settings/datasources.html'
    });

}];
