module.exports = ['$stateProvider', '$urlMatcherFactoryProvider', function ($stateProvider, $urlMatcherFactoryProvider) {

    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
        .state(
            {
                name: 'login',
                url: '/login',
                controller: require('./login.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'forbidden',
                url: '/forbidden',
                controller: require('./forbidden.controller.js'),
                template: require('./forbidden.html')
            }
        )
        .state(
            {
                name: 'register',
                url: '/register',
                controller: require('./register.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'forgotpassword',
                url: '/forgotpassword',
                controller: require('./password-reset.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'confirm',
                url: '/forgotpassword/confirm',
                controller: require('./password-reset-confirm.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'confirm.token',
                url: '/:token',
                controller: require('./password-reset-confirm.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: '404',
                url: '/404',
                controller: require('./404.controller.js'),
                template: require('./404.html')
            }
        )
}];
