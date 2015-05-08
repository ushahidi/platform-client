angular.module('sets', [])

.directive('setsMenu', require('./directives/sets-menu-directive.js'))

.service('SetsEndpoint', require('./services/endpoints/set.js'));
