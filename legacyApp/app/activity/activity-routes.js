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

            var $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return System.import('./app/activity/activity-lazy.js').then(mod => {
                console.log(mod)
                //  $ocLazyLoad.load(mod.CONTACTS_MODULE));
            })}
          
        // resolve: {
        //     loadDependencies: ['$ocLazyLoad', function($ocLazyLoad) {
        //         return $ocLazyLoad.load([
        //             './activity/activity-module.js',
        //             './activity/activity-timeline.directive.js',
        //             './activity/activity.controller.js',
        //             './activity/bar-chart.directive.js',
        //             './activity/crowdsourced-survey-table.directive.js',
        //             './activity/targeted-survey-table.directive.js',
        //             './activity/time-chart.directive.js'
        //         ]);
        //     }]
        // }
    });
}];
