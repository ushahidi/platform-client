module.exports = ['$stateProvider', '$urlMatcherFactoryProvider', function ($stateProvider, $urlMatcherFactoryProvider) {

    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
        .state(
            {
                name: 'login',
                url: '/login',
                controller: require('./auth/login.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'forbidden',
                url: '/forbidden',
                controller: require('./auth/forbidden.controller.js'),
                template: require('./auth/forbidden.html')
            }
        )
        .state(
            {
                name: 'register',
                url: '/register',
                controller: require('./auth/register.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'forgotpassword',
                url: '/forgotpassword',
                controller: require('./auth/password-reset.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'confirm',
                url: '/forgotpassword/confirm',
                controller: require('./auth/password-reset-confirm.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: 'confirm.token',
                url: '/:token',
                controller: require('./auth/password-reset-confirm.controller.js'),
                template: ''
            }
        )
        .state(
            {
                name: '404',
                url: '/404',
                controller: require('./auth/404.controller.js'),
                template: require('./auth/404.html')
            }
        )
        ;
}];
