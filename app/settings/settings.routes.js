module.exports = [
    '$routeProvider',
function (
    $routeProvider
) {
    /* todo: these routes should only exist when the user is admin! */
    $routeProvider
    .when('/settings', {
        controller: require('./settings.controller.js'),
        template: require('./settings.html')
    })
    .when('/settings/general', {
        controller: require('./site/site.controller.js'),
        template: require('./site/settings-general.html')
    })
    .when('/settings/data-import', {
        controller: require('./data-import/data-import.controller.js'),
        template: require('./data-import/data-import.html')
    })
    .when('/settings/data-after-import', {
        controller: require('./data-import/data-after-import.controller.js'),
        template: require('./data-import/after-import.html')
    })
    .when('/settings/surveys', {
        controller: require('./surveys/surveys.controller.js'),
        template: require('./surveys/surveys.html')
    })
    .when('/settings/surveys/create', {
        controller: require('./surveys/edit.controller.js'),
        template: require('./surveys/survey-edit.html')
    })
    .when('/settings/surveys/:action/:id', {
        controller: require('./surveys/edit.controller.js'),
        template: require('./surveys/survey-edit.html')
    })
    .when('/settings/categories', {
        controller: require('./categories/categories.controller.js'),
        template: require('./categories/categories.html')
    })
    .when('/settings/categories/create', {
        controller: require('./categories/edit.controller.js'),
        template: require('./categories/categories-edit.html')
    })
    .when('/settings/categories/:id', {
        controller: require('./categories/edit.controller.js'),
        template: require('./categories/categories-edit.html')
    })
    .when('/settings/users', {
        controller: require('./users/users.controller.js'),
        template: require('./users/users.html')
    })
    .when('/settings/users/create', {
        controller: require('./users/create.controller.js'),
        template: require('./users/users-edit.html')
    })
    .when('/settings/users/:id', {
        controller: require('./users/edit.controller.js'),
        template: require('./users/users-edit.html')
    })
    .when('/settings/roles', {
        controller: require('./roles/roles.controller.js'),
        template: require('./roles/roles.html')
    })
    .when('/settings/roles/create', {
        controller: require('./roles/roles.controller.js'),
        template: require('./roles/roles-edit.html')
    })
    .when('/settings/roles/:id', {
        controller: require('./roles/roles.controller.js'),
        template: require('./roles/roles-edit.html')
    })
    .when('/settings/webhooks', {
        controller: require('./webhooks/webhooks.controller.js'),
        template: require('./webhooks/webhooks.html')
    })
    .when('/settings/webhooks/create', {
        controller: require('./webhooks/webhooks.controller.js'),
        template: require('./webhooks/webhooks-edit.html')
    })
    .when('/settings/webhooks/:id', {
        controller: require('./webhooks/webhooks.controller.js'),
        template: require('./webhooks/webhooks-edit.html')
    })
    .when('/settings/datasources', {
        controller: require('./datasources/datasources.controller.js'),
        template: require('./datasources/datasources.html')
    })
    .when('/settings/plan', {
        controller: require('./plans/plans.controller.js'),
        template: require('./plans/plan.html')
    })
    ;

}];
