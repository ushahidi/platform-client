module.exports = [
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
            .state({
                name: 'settings.list',
                url: '/settings',
                template: require('./settings-list.html'),
                controller: require('./settings-list.controller.js'),
                lazyLoad: function ($transition$) {
                    console.log('Settings-list!!!');
                    const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
                    return System.import('/settings.js').then(mod => {
                        console.log(mod);
                        $ocLazyLoad.load(mod.SETTINGS_MODULE);
                    });
                }
            })
    }
];
