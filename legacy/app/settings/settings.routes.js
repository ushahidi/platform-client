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
                template: require('./settings.html')
            })

            /* ==============================================
            Lazy load settings module depending on where user 
            clicks first (mode-bar or mode-context link)
            ================================================*/
            .state({
                name: 'settings.list',
                url: '/settings',
                template: require('./settings-list.html'),
                controller: require('./settings-list.controller.js'),
                lazyLoad: function ($transition$) {
                    const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
                    return System.import('/settings.js').then(mod => {
                        $ocLazyLoad.load(mod.SETTINGS_MODULE);
                    });
                }
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
                template: require('./surveys/survey-edit.html'),
                lazyLoad: function ($transition$) {
                    const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
                    return System.import('/settings.js').then(mod => {
                        $ocLazyLoad.load(mod.SETTINGS_MODULE);
                    });
                }
            })
            .state({
                name: 'settings.surveys.id',
                url: '/:action/:id',
                controller: require('./surveys/edit.controller.js'),
                template: require('./surveys/survey-edit.html'),
                lazyLoad: function ($transition$) {
                    const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
                    return System.import('/settings.js').then(mod => {
                        $ocLazyLoad.load(mod.SETTINGS_MODULE);
                    });
                }
            })
    }
]);
