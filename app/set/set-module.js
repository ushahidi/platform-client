angular.module('ushahidi.sets', [])

.directive('setsMenu', require('./directives/sets-menu-directive.js'))

.service('CollectionEndpoint', require('./services/endpoints/collection.js'))
.service('SavedSearchEndpoint', require('./services/endpoints/savedsearch.js'));
