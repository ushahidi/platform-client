angular.module('ushahidi.map', [])

// Map view
.directive('postViewMap', require('./post-view-map.directive.js'))

// Post card related (needed in both map and data views)
.directive('postCard', require('./post-card/post-card.directive.js'))
.directive('postPreviewMedia', require('./post-card/post-preview-media.directive.js'))
.directive('postActions', require('./post-card/post-actions.directive.js'))
.service('PostActionsService', require('./post-card/post-actions.service.js'))
.directive('postMetadata', require('./post-card/post-metadata.directive.js'))
.service('PostMetadataService', require('./post-card/post-metadata.service.js'))
.directive('collectionToggleLink', require('./post-card/collection-toggle/collection-toggle-link.js'))

// Mode context
.directive('modeContext', require('./mode-context/mode-context.directive.js'))
.directive('modeContextFormFilter', require('./mode-context/mode-context-form-filter.directive.js'))
.directive('filterBySurveyDropdown', require('./mode-context/filter-by-survey-dropdown.directive.js'))
.directive('filterByDatasource', require('./mode-context/filter-by-datasource.directive.js'))

// Post toolbar
.directive('postToolbar', require('./post-toolbar/post-toolbar.directive.js'))
.directive('filterPosts', require('./post-toolbar/filter-posts.directive.js'))
.directive('sortAndFilterCounter', require('./post-toolbar/sort-and-filter-counter.directive.js'))
// Add post
.directive('addPostButton', require('./post-toolbar/add-post/add-post-button.directive.js'))
.directive('addPostSurveyList', require('./post-toolbar/add-post/add-post-survey-list.directive.js'))
// Share
.directive('postShare', require('./post-toolbar/share/post-share.directive.js'))
.directive('shareMenu', require('./post-toolbar/share/share-menu.directive.js'))
.directive('shareMenuModal', require('./post-toolbar/share/share-menu-modal.directive.js'))
.directive('postExport', require('./post-toolbar/share/post-export.directive.js'))

.config(require('./map-routes.js'))

.run(['Leaflet', function (L) {
    L.Icon.Default.imagePath = '/img';
}]);