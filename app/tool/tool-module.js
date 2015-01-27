require('angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module');
require('angular-xeditable');

angular.module('tools', [
    'colorpicker.module',
    'xeditable'
])
.directive('toolMenu', require('./directives/tool-menu-directive.js'))
.config(require('./tool-routes.js'));
