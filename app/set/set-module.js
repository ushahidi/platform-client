angular.module('ushahidi.sets', [])

.config(require('./set-routes.js'))

.directive('setsMenu', require('./directives/sets-menu-directive.js'))
.directive('savedsearchEditor', require('./directives/savedsearch-editor-directive.js'))
.directive('savedsearchCreate', require('./directives/savedsearch-create-directive.js'))
.directive('savedsearchUpdate', require('./directives/savedsearch-update-directive.js'))
.directive('collectionEditor', require('./directives/collection-editor-directive.js'))
.directive('selectCollection', require('./directives/select-collection-directive.js'))

.service('CollectionEndpoint', require('./services/endpoints/collection.js'))
.service('SavedSearchEndpoint', require('./services/endpoints/savedsearch.js'));
