angular.module('ushahidi.sets', [])

.config(require('./set-routes.js'))

.directive('savedsearchEditor', require('./directives/savedsearches/editor-directive.js'))
.directive('savedsearchCreate', require('./directives/savedsearches/create-directive.js'))
.directive('savedsearchUpdate', require('./directives/savedsearches/update-directive.js'))
.directive('savedSearchListing', require('./directives/savedsearches/listing.directive.js'))

.directive('collectionModeContext', require('./directives/collections/mode-context.directive.js'))
.directive('collectionEditor', require('./directives/collections/editor.directive.js'))
.directive('collectionListing', require('./directives/collections/listing.directive.js'))

.service('CollectionEndpoint', require('./services/endpoints/collection.js'))
.service('SavedSearchEndpoint', require('./services/endpoints/savedsearch.js'));
