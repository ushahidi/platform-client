require('angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module');
require('angular-xeditable');

angular.module('ushahidi.tools', [
    'colorpicker.module',
    'xeditable'
])
.directive('formEditor', require('./directives/setting-form-editor-directive.js'))
.directive('formStageEditor', require('./directives/setting-form-stage-editor-directive.js'))

.directive('appearanceEditor', require('./directives/setting-appearance-directive.js'))

.config(require('./setting-routes.js'));
