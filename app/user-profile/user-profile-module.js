angular.module('ushahidi.user-profile', [])
.directive('accountSettings', require('./directives/account-settings.js'))
.directive('userProfile', require('./directives/user-profile.js'))
.directive('notifications', require('./directives/notifications.js'))
.service('ContactEndpoint', require('./services/endpoints/contact.js'))
.service('NotificationEndpoint', require('./services/endpoints/notification.js'));
