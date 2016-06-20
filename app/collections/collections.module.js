angular.module('ushahidi.collections', [])

.config(require('./collections.routes.js'))

.directive('collectionModeContext', require('./mode-context.directive.js'))
.directive('collectionEditor', require('./editor.directive.js'))
.directive('collectionListing', require('./listing.directive.js'));
