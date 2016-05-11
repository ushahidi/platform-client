module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/settings', {
        controller: require('./controllers/setting-controller.js'),
        templateUrl: 'templates/settings/settings.html'
    })
    .when('/settings/general', {
        controller: require('./controllers/setting-general-controller.js'),
        templateUrl: 'templates/settings/settings-general.html'
    })
    .when('/settings/map-settings', {
        controller: require('./controllers/setting-map-settings.js'),
        templateUrl: 'templates/settings/map-settings.html'
    })
    .when('/settings/data-import', {
        controller: require('./controllers/setting-data-import-controller.js'),
        templateUrl: 'templates/settings/data-import/data-import.html'
    })
    .when('/settings/data-configure', {
        controller: require('./controllers/setting-data-configure-controller.js'),
        templateUrl: 'templates/settings/data-import/data-configure.html'
    })
    .when('/settings/data-mapper/:formId/:id', {
        controller: require('./controllers/setting-data-mapper-controller.js'),
        templateUrl: 'templates/settings/data-import/data-mapper.html',
        resolve: {
            initialData: ['$route', 'DataRetriever', function ($route, DataRetriever) {
                return DataRetriever.dataMapperInitialData(
                    $route.current.params.formId,
                    $route.current.params.id
                );
            }]
        }
    })
    .when('/settings/plugins', {
        controller: require('./controllers/setting-plugins-controller.js'),
        templateUrl: 'templates/settings/todo.html'
    })
    .when('/settings/forms', {
        controller: require('./controllers/setting-forms-controller.js'),
        templateUrl: 'templates/settings/forms/forms.html'
    })
    .when('/settings/forms/:id', {
        controller: require('./controllers/setting-forms-edit-controller.js'),
        templateUrl: 'templates/settings/forms/form-edit.html'
    })
    .when('/settings/categories', {
        controller: require('./controllers/setting-categories-controller.js'),
        templateUrl: 'templates/settings/categories/categories.html'
    })
    .when('/settings/categories/create', {
        controller: require('./controllers/setting-categories-create-controller.js'),
        templateUrl: 'templates/settings/categories/categories-edit.html'
    })
    .when('/settings/categories/:id', {
        controller: require('./controllers/setting-categories-edit-controller.js'),
        templateUrl: 'templates/settings/categories/categories-edit.html'
    })
    .when('/settings/views', {
        controller: require('./controllers/setting-views-controller.js'),
        templateUrl: 'templates/settings/todo.html'
    })
    .when('/settings/users', {
        controller: require('./controllers/setting-users-controller.js'),
        templateUrl: 'templates/settings/users/users.html'
    })
    .when('/settings/users/create', {
        controller: require('./controllers/setting-users-create-controller.js'),
        templateUrl: 'templates/settings/users/users-edit.html'
    })
    .when('/settings/users/:id', {
        controller: require('./controllers/setting-users-edit-controller.js'),
        templateUrl: 'templates/settings/users/users-edit.html'
    })
    .when('/settings/roles', {
        controller: require('./controllers/setting-roles-controller.js'),
        templateUrl: 'templates/settings/roles/roles.html'
    })
    .when('/settings/roles/create', {
        controller: require('./controllers/setting-roles-controller.js'),
        templateUrl: 'templates/settings/roles/roles-edit.html'
    })
    .when('/settings/roles/:id', {
        controller: require('./controllers/setting-roles-controller.js'),
        templateUrl: 'templates/settings/roles/roles-edit.html'
    })
    .when('/settings/datasources', {
        controller: require('./controllers/setting-datasources-controller.js'),
        templateUrl: 'templates/settings/datasources/datasources.html'
    })
    ;

}];
