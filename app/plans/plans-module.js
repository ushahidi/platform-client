angular.module('ushahidi.plans', [
	'ushahidi.common'
])

.config(require('./plans-routes.js'))
.config(['MenuHelperProvider', function (MenuHelperProvider) {
    MenuHelperProvider.addMenuItem('settings', {
        url : '/settings/plan',
        text : 'nav.plan_settings'
    });
}])
;
