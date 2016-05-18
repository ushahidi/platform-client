angular.module('ushahidi.frame', [])

.directive('modeBar', require('./directives/mode-bar.js'))
.directive('modeContext', require('./directives/mode-context/mode-context.js'))
.directive('modeContextSettings', require('./directives/mode-context/mode-context-settings.js'))
.directive('toolBar', require('./directives/toolbar.js'));
