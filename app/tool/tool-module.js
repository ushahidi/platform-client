require('angular-xeditable');
require('../common/modules/gravatar-helper.js');

angular.module('tools', [
    'xeditable',
    'gravatarHelper'
])
.directive('toolMenu', require('./directives/tool-menu-directive.js'))
.config(require('./tool-routes.js'));
