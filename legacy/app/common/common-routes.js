module.exports = ['$stateProvider', '$urlMatcherFactoryProvider', function ($stateProvider, $urlMatcherFactoryProvider) {

    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
        .state({
            name: 'verifier',
            url: '/verifier',
            controller: require('./verifier/verifier.controller.js'),
            template: require('./verifier/verifier.html')
        });
}];
