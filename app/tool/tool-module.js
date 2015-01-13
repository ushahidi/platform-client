require('angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module');
require('angular-xeditable');
require('../common/modules/gravatar-helper.js');

angular.module('tools', [
    'colorpicker.module',
    'xeditable',
    'gravatarHelper'
])
.directive('toolMenu', require('./directives/tool-menu-directive.js'))
.config(require('./tool-routes.js'));
