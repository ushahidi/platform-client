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
                return import(/* webpackChunkName: "activity.module" */ './activity-module')
                       .then(mod => $ocLazyLoad.load(mod.ACTIVITY_MODULE))
                       .catch(err => {
                           console.log('Hey, dosent work yet: ', err);
                            //throw new Error('Hey, dosent work yet: ' + err)
                       });
                //return $ocLazyLoad.load('ushahidi.activity');
            }]
        }
        /*lazyload: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return import(/* webpackChunkName: "activity.module" *\/ './activity-module')
            .then(mod => $ocLazyLoad.load(mod.ACTIVITY_MODULE))
            .catch(err => {
                console.log('Hey, dosent work yet: ', err);
                 //throw new Error('Hey, dosent work yet: ' + err)
            });
        }*/
    });
}];
