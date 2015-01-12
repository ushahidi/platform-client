require('../common/modules/gravatar-helper.js');

angular.module('users', [
    'gravatarHelper'
])
.config(require('./user-routes.js'));
