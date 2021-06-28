angular.module('ushahidi.user-profile', [])
.directive('accountSettings', require('./account-settings.directive.js'))
.directive('adminUserSetup', require('./admin-user-setup.directive'))
.directive('userProfile', require('./user-profile.directive.js'))
.directive('notifications', require('./notifications.directive.js'))
;
