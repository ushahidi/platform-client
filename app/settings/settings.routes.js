module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/settings', {
        controller: require('./settings.controller.js'),
        templateUrl: 'templates/settings/settings.html'
    })
    .when('/settings/general', {
        controller: require('./site/site.controller.js'),
        templateUrl: 'templates/settings/site/settings-general.html'
    })
    .when('/settings/data-import', {
        controller: require('./data-import/data-import.controller.js'),
        templateUrl: 'templates/settings/data-import/data-import.html'
    })
    .when('/settings/data-after-import', {
        controller: require('./data-import/data-after-import.controller.js'),
        templateUrl: 'templates/settings/data-import/after-import.html'
    })
    .when('/settings/surveys', {
        controller: require('./surveys/surveys.controller.js'),
        templateUrl: 'templates/settings/surveys/surveys.html'
    })
    .when('/settings/surveys/create', {
        controller: require('./surveys/edit.controller.js'),
        templateUrl: 'templates/settings/surveys/survey-edit.html'
    })
    .when('/settings/surveys/:id', {
        controller: require('./surveys/edit.controller.js'),
        templateUrl: 'templates/settings/surveys/survey-edit.html'
    })
    .when('/settings/categories', {
        controller: require('./categories/categories.controller.js'),
        templateUrl: 'templates/settings/categories/categories.html'
    })
    .when('/settings/categories/create', {
        controller: require('./categories/create.controller.js'),
        templateUrl: 'templates/settings/categories/categories-edit.html'
    })
    .when('/settings/categories/:id', {
        controller: require('./categories/edit.controller.js'),
        templateUrl: 'templates/settings/categories/categories-edit.html',
        resolve: {
            category: ['$route', 'TagEndpoint', function ($route, TagEndpoint) {
                return TagEndpoint.getFresh({id: $route.current.params.id});
            }]
        }
    })
    .when('/settings/users', {
        controller: require('./users/users.controller.js'),
        templateUrl: 'templates/settings/users/users.html'
    })
    .when('/settings/users/create', {
        controller: require('./users/create.controller.js'),
        templateUrl: 'templates/settings/users/users-edit.html'
    })
    .when('/settings/users/:id', {
        controller: require('./users/edit.controller.js'),
        templateUrl: 'templates/settings/users/users-edit.html'
    })
    .when('/settings/roles', {
        controller: require('./roles/roles.controller.js'),
        templateUrl: 'templates/settings/roles/roles.html'
    })
    .when('/settings/roles/create', {
        controller: require('./roles/roles.controller.js'),
        templateUrl: 'templates/settings/roles/roles-edit.html'
    })
    .when('/settings/roles/:id', {
        controller: require('./roles/roles.controller.js'),
        templateUrl: 'templates/settings/roles/roles-edit.html'
    })
    .when('/settings/datasources', {
        controller: require('./datasources/datasources.controller.js'),
        templateUrl: 'templates/settings/datasources/datasources.html'
    })
    .when('/settings/plan', {
        controller: require('./plans/plans.controller.js'),
        templateUrl: 'templates/settings/plan/plan.html'
    })
    ;

}];
