angular.module('ushahidi.sets', [])

.config(require('./set-routes.js'))

.directive('setsMenu', require('./directives/sets-menu-directive.js'))

.service('CollectionEndpoint', require('./services/endpoints/collection.js'))
.service('SavedSearchEndpoint', require('./services/endpoints/savedsearch.js'));
