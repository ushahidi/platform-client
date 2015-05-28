require('angular-xeditable');

angular.module('ushahidi.user-profile', [
    'xeditable'
])

.controller('userProfile', require('./controllers/user-profile-controller.js'))
.config(require('./user-profile-routes.js'));
