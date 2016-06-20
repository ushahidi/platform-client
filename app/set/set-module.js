angular.module('ushahidi.sets', [])

.config(require('./set-routes.js'))

.directive('savedSearchEditor', require('./directives/savedsearches/editor-directive.js'))
.directive('savedSearchCreate', require('./directives/savedsearches/create-directive.js'))
.directive('savedSearchUpdate', require('./directives/savedsearches/update-directive.js'))
.directive('savedSearchListing', require('./directives/savedsearches/listing.directive.js'))
.directive('savedSearchModeContext', require('./directives/savedsearches/mode-context.directive.js'))

.directive('collectionModeContext', require('./directives/collections/mode-context.directive.js'))
.directive('collectionEditor', require('./directives/collections/editor.directive.js'))
.directive('collectionListing', require('./directives/collections/listing.directive.js'));
