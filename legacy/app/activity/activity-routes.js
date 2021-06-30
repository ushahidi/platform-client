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
        lazyLoad: function ($transition$) {
            console.log('here');
            var $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return System.import('/activity.js').then(mod => {
                console.log(mod);
                $ocLazyLoad.load(mod.ACTIVITY_MODULE);
            });
        }
    });
}];
