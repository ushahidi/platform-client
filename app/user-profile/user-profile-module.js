require('angular-xeditable');

angular.module('ushahidi.user-profile', [
    'xeditable'
])
.service('ContactEndpoint', require('./services/endpoints/contact.js'))
.service('NotificationEndpoint', require('./services/endpoints/notification.js'))
.controller('userProfile', require('./controllers/user-profile-controller.js'))
.config(require('./user-profile-routes.js'));
