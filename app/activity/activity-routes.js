module.exports = [
    '$stateProvider',
    '$urlMatcherFactoryProvider',
function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
    .state({
        name: 'activity',
        url: '/activity',
        controller: require('./activity.controller.js'),
        template: require('./activity.html'),
        resolve: {
            loadDependencies: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('ushahidi.activity');
            }]
        }
    });
}];
