angular.module('ushahidi.notifications', [])
.config(require('./notification-routes.js'))
.service('NotificationEndpoint', require('./services/endpoints/notification.js'));

