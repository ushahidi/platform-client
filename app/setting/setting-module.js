require('angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module');
require('angular-xeditable');

angular.module('ushahidi.tools', [
    'colorpicker.module',
    'xeditable'
])
.directive('dataImport', require('./directives/setting-data-import-directive.js'))
.directive('formEditor', require('./directives/setting-form-editor-directive.js'))

.directive('settingsEditor', require('./directives/setting-editor-directive.js'))

.config(require('./setting-routes.js'));
