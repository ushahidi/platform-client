require('angular-xeditable');
require('../common/modules/gravatar-helper.js');

angular.module('user-profile', [
    'xeditable',
    'gravatarHelper'
])

.controller('userProfile', require('./controllers/user-profile-controller.js'))
.config(require('./user-profile-routes.js'));
