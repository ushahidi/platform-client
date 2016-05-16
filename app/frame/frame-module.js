angular.module('ushahidi.frame', [])

.directive('modeBar', require('./directives/mode-bar.js'))
.directive('modeContext', require('./directives/mode-context.js'))
.directive('toolBar', require('./directives/toolbar.js'));
