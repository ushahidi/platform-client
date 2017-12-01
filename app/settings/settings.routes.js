module.exports = [
    '$stateProvider',
    '$urlMatcherFactoryProvider',
function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    $urlMatcherFactoryProvider.strictMode(false);
    /* todo: these routes should only exist when the user is admin! */
    $stateProvider
    .state(
        {
            name: 'settings',
            controller: require('./settings.controller.js'),
            template: require('./settings.html')
        }
    )
    .state(
        {
            name: 'settings.list',
            url: '/settings',
            template: require('./settings-list.html'),
            controller: require('./settings-list.controller.js')
        }
    )
    .state(
        {
            name: 'settings.general',
            url: '/settings/general',
            controller: require('./site/site.controller.js'),
            template: require('./site/settings-general.html')
        }
    )
    .state(
        {
            name: 'settings.dataImport',
            url: '/settings/data-import',
            controller: require('./data-import/data-import.controller.js'),
            template: require('./data-import/data-import.html')
        }
    )
    .state(
        {
            name: 'settings.dataAfterImport',
            url: '/settings/data-after-import',
            controller: require('./data-import/data-after-import.controller.js'),
            template: require('./data-import/after-import.html')
        }
    )
    .state(
        {
            name: 'settings.surveys',
            url: '/settings/surveys',
            controller: require('./surveys/surveys.controller.js'),
            template: require('./surveys/surveys.html')
        }
    )
    .state(
        {
            name: 'settings.surveys.create',
            url: '/create',
            controller: require('./surveys/edit.controller.js'),
            template: require('./surveys/survey-edit.html')
        }
    )
    .state(
        {
            name: 'settings.surveys.id',
            url: '/:action/:id',
            controller: require('./surveys/edit.controller.js'),
            template: require('./surveys/survey-edit.html')
        }
    )
    .state(
        {
            name: 'settings.categories',
            url: '/settings/categories',
            controller: require('./categories/categories.controller.js'),
            template: require('./categories/categories.html')
        }
    )
    .state(
        {
            name: 'settings.categories.create',
            url: '/create',
            controller: require('./categories/edit.controller.js'),
            template: require('./categories/categories-edit.html')
        }
    )
    .state(
        {
            name: 'settings.categories.edit',
            url: '/:id',
            controller: require('./categories/edit.controller.js'),
            template: require('./categories/categories-edit.html')
        }
    )
    .state(
        {
            name: 'settings.users',
            url: '/settings/users',
            controller: require('./users/users.controller.js'),
            template: require('./users/users.html')
        }
    )
    .state(
        {
            name: 'settings.users.create',
            url: '/create',
            controller: require('./users/create.controller.js'),
            template: require('./users/users-edit.html')
        }
    )
    .state(
        {
            name: 'settings.users.edit',
            url: '/:id',
            controller: require('./users/edit.controller.js'),
            template: require('./users/users-edit.html')
        }
    )
    .state(
        {
            name: 'settings.roles',
            url: '/settings/roles',
            controller: require('./roles/roles.controller.js'),
            template: require('./roles/roles.html')
        }
    )
    .state(
        {
            name: 'settings.roles.create',
            url: '/create',
            controller: require('./roles/roles.controller.js'),
            template: require('./roles/roles-edit.html')
        }
    )
    .state(
        {
            name: 'settings.roles.edit',
            url: '/:id',
            controller: require('./roles/roles.controller.js'),
            template: require('./roles/roles-edit.html')
        }
    )
    .state(
        {
            name: 'settings.webhooks',
            url: '/settings/webhooks',
            controller: require('./webhooks/webhooks.controller.js'),
            template: require('./webhooks/webhooks.html')
        }
    )
    .state(
        {
            name: 'settings.webhooks.create',
            url: '/create',
            controller: require('./webhooks/webhooks.controller.js'),
            template: require('./webhooks/webhooks-edit.html')
        }
    )
    .state(
        {
            name: 'settings.webhooks.edit',
            url: '/:id',
            controller: require('./webhooks/webhooks.controller.js'),
            template: require('./webhooks/webhooks-edit.html')
        }
    )
    .state(
        {
            name: 'settings.datasources',
            url: '/settings/datasources',
            controller: require('./datasources/datasources.controller.js'),
            template: require('./datasources/datasources.html')
        }
    )
    .state(
        {
            name: 'settings.plan',
            url: '/settings/plan',
            controller: require('./plans/plans.controller.js'),
            template: require('./plans/plan.html')
        }
    );
}];
