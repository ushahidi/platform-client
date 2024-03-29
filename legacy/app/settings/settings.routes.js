angular.module('ushahidi.settings.routes', [])

.config([
    '$stateProvider',
    '$urlMatcherFactoryProvider',
    function ($stateProvider, $urlMatcherFactoryProvider) {
        $urlMatcherFactoryProvider.strictMode(false);
        /* todo: these routes should only exist when the user is admin! */
        $stateProvider
            .state({
                name: 'settings',
                controller: require('./settings.controller.js'),
                template: require('./settings.html'),
                lazyLoad: function ($transition$) {
                    const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
                    return System.import('@ushahidi/legacy-settings').then(mod => {
                        $ocLazyLoad.load(mod.SETTINGS_MODULE);
                    });
                }
            })
            .state({
                name: 'settings.list',
                url: '/settings',
                template: require('./settings-list.html'),
                controller: require('./settings-list.controller.js')
            })
            .state({
                name: 'settings.surveys',
                url: '/settings/surveys',
                controller: require('./surveys/surveys.controller.js'),
                template: require('./surveys/surveys.html')
            })
            .state({
                name: 'settings.surveys.create',
                url: '/create',
                controller: require('./surveys/edit.controller.js'),
                template: require('./surveys/survey-edit.html')
            })
            .state({
                name: 'settings.surveys.id',
                url: '/:action/:id',
                controller: require('./surveys/edit.controller.js'),
                template: require('./surveys/survey-edit.html')
            })
            .state({
                name: 'settings.datasources',
                url: '/settings/datasources',
                controller: require('./datasources/datasources.controller.js'),
                template: require('./datasources/datasources.html')
            })
    }
]);
