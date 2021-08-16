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

// Post editing workflows
.directive('filterPostSortingOptions', require('./post-toolbar/filters/filter-post-sorting-options.directive.js'))
.directive('filterPostOrderAscDesc', require('./post-toolbar/filters/filter-post-order-asc-desc.directive.js'))
.directive('filterUnlockedOnTop', require('./post-toolbar/filters/filter-unlocked-on-top.directive.js'))

// Filters
.directive('filterCategory', require('./post-toolbar/filters/filter-category.directive.js'))
.directive('filterDate', require('./post-toolbar/filters/filter-date.directive.js'))
.directive('filterForm', require('./post-toolbar/filters/filter-form.directive.js'))
.directive('filterVisibleTo', require('./post-toolbar/filters/filter-visible-to.directive.js'))
.directive('filterStatus', require('./post-toolbar/filters/filter-status.directive.js'))
.directive('filterSource', require('./post-toolbar/filters/filter-source.directive.js'))
.directive('filterLocation', require('./post-toolbar/filters/filter-location.directive.js'))
.directive('filterHasLocation', require('./post-toolbar/filters/filter-has-location.directive.js'))
.directive('postActiveSearchFilters', require('./post-toolbar/filters/active-search-filters.directive.js'))
.service('FilterTransformers', require('./post-toolbar/filters/filter-transformers.service.js'))
.directive('filtersDropdown', require('./post-toolbar/filters/filters-dropdown.directive.js'))
.directive('filterSavedSearch', require('./post-toolbar/filters/filter-saved-search.directive.js'))

// Saved search
.directive('savedSearchEditor', require('./savedsearches/editor-directive.js'))
.directive('savedSearchModeContext', require('./savedsearches/mode-context.directive.js'))

// Collection
.directive('collectionModeContext', require('./collections/mode-context.directive.js'))
.directive('collectionEditor', require('./collections/editor.directive.js'))
.directive('collectionListing', require('./collections/listing.directive.js'))

// From common module
.service('ViewHelper', require('./services/view-helper.js'))

.config(require('./map-routes.js'))

.run(['Leaflet', function (L) {
    L.Icon.Default.imagePath = '/img';
}]);