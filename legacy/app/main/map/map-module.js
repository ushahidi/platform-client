angular.module('ushahidi.map', [])

// Timeline, data and Map screen
.directive('postViewMap', require('./post-view-map.directive.js'))

//Mode context
.directive('modeContext', require('./mode-context/mode-context.directive.js'))
.directive('modeContextFormFilter', require('./mode-context/mode-context-form-filter.directive.js'))
.directive('filterBySurveyDropdown', require('./mode-context/filter-by-survey-dropdown.directive.js'))
.directive('filterByDatasource', require('./mode-context/filter-by-datasource.directive.js'))

.directive('addPostButton', require('./post-toolbar/add-post-button.directive.js'))
.directive('addPostSurveyList', require('./post-toolbar/add-post-survey-list.directive.js'))
.directive('addPostTextButton', require('./post-toolbar/add-post-text-button.directive.js'))

// Post editing workflows
.directive('filterPostSortingOptions', require('./post-toolbar/filters/filter-post-sorting-options.directive.js'))
.directive('filterPostOrderAscDesc', require('./post-toolbar/filters/filter-post-order-asc-desc.directive.js'))
.directive('filterUnlockedOnTop', require('./post-toolbar/filters/filter-unlocked-on-top.directive.js'))

// Filters
.directive('postToolbar', require('./post-toolbar/post-toolbar.directive.js'))
.directive('filterPosts', require('./post-toolbar/filters/filter-posts.directive.js'))
.directive('filterCategory', require('./post-toolbar/filters/filter-category.directive.js'))
.directive('filterDate', require('./post-toolbar/filters/filter-date.directive.js'))
.directive('filterForm', require('./post-toolbar/filters/filter-form.directive.js'))
.directive('filterVisibleTo', require('./post-toolbar/filters/filter-visible-to.directive.js'))
.directive('filterStatus', require('./post-toolbar/filters/filter-status.directive.js'))
.directive('filterSource', require('./post-toolbar/filters/filter-source.directive.js'))
.directive('filterLocation', require('./post-toolbar/filters/filter-location.directive.js'))
.directive('filterHasLocation', require('./post-toolbar/filters/filter-has-location.directive.js'))
.directive('postActiveSearchFilters', require('./post-toolbar/filters/active-search-filters.directive.js'))
.service('PostFilters', require('./post-toolbar/post-filters.service.js'))
.service('FilterTransformers', require('./post-toolbar/filters/filter-transformers.service.js'))
.directive('filtersDropdown', require('./post-toolbar/filters/filters-dropdown.directive.js'))
.directive('filterSavedSearch', require('./post-toolbar/filters/filter-saved-search.directive.js'))
.directive('sortAndFilterCounter', require('./post-toolbar/filters/sort-and-filter-counter.directive.js'))
// Share
.directive('postShare', require('./post-toolbar/share/post-share.directive.js'))
.directive('shareMenu', require('./post-toolbar/share/share-menu.directive.js'))
.directive('shareMenuModal', require('./post-toolbar/share/share-menu-modal.directive.js'))
.directive('postExport', require('./post-toolbar/share/post-export.directive.js'))

.config(require('./map-routes.js'))

.run(['Leaflet', function (L) {
    L.Icon.Default.imagePath = '/img';
}]);