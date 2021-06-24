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
        /*resolve: {
            loadDependencies: ['$ocLazyLoad', function($ocLazyLoad) {
                //console.log('Testing!!!');
                return import(/* webpackChunkName: "activity.module" *\/ './activity-module')
                       .then(mod => $ocLazyLoad.load(mod.ACTIVITY_MODULE))
                       .catch(err => {
                           console.log('Hey, dosent work yet: ', err);
                            //throw new Error('Hey, dosent work yet: ' + err)
                       });
                //return $ocLazyLoad.load('ushahidi.activity');
            }]
        }*/
        lazyLoad: ($transition$) => {
            //console.log('Testing!!!');
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return import(/* webpackChunkName: "activity-module" */ './activity-module')
            .then(mod => $ocLazyLoad.load(mod.ACTIVITY_MODULE))
            .catch(err => {
                console.log('Hey, dosent work yet: ', err);
                //throw new Error('Hey, dosent work yet: ' + err)
            });
        }
        /*
        lazyLoad: async ($transition$) => {
            console.log('Testing!!!');
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            try {
                const mod = await import(/* webpackChunkName: "activity.module" *\/ './activity-module');
                return $ocLazyLoad.load(mod.ACTIVITY_MODULE);
            } catch (err) {
                //console.log('Hey, dosent work yet: ', err);
                throw new Error('Hey, dosent work yet: ' + err);
            }
        }*/
    });
}];
