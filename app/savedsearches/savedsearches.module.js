angular.module('ushahidi.savedsearches', [])

.config(require('./savedsearches.routes.js'))

.directive('savedSearchEditor', require('./editor-directive.js'))
.directive('savedSearchCreate', require('./create-directive.js'))
.directive('savedSearchUpdate', require('./update-directive.js'))
.directive('savedSearchListing', require('./listing.directive.js'))
.directive('savedSearchModeContext', require('./mode-context.directive.js'))
;
