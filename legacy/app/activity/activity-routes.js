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
console.log('here')

        // return $transition$.injector().get('$ocLazyLoad').load(System.import('/activity.js'));

            var $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return System.import('/activity.js').then(mod => {
                 console.log(mod)
                 $ocLazyLoad.load(mod.ACTIVITY_MODULE)
            })
        }
        })
          
    //     resolve: {
    //         loadDependencies: ['$ocLazyLoad', function($ocLazyLoad) {
    //             return $ocLazyLoad.load('/activity.js')
    //                 // './activity/activity-module.js',
    //                 // './activity/activity-timeline.directive.js',
    //                 // './activity/activity.controller.js',
    //                 // './activity/bar-chart.directive.js',
    //     //             './activity/crowdsourced-survey-table.directive.js',
    //     //             './activity/targeted-survey-table.directive.js',
    //     //             './activity/time-chart.directive.js'
    //     //         ]);
    //         }]
    //     }
    // });
}];
