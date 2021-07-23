angular.module('ushahidi.posts', [])

// Post view service
.service('PostViewService', require('./post-view.service.js'))
.directive('addPostTextButton', require('./add-post-text-button.directive.js'))

// Post editing workflows
.directive('filterPostSortingOptions', require('./post-toolbar/filters/filter-post-sorting-options.directive.js'))
.directive('filterPostOrderAscDesc', require('./post-toolbar/filters/filter-post-order-asc-desc.directive.js'))
.directive('filterUnlockedOnTop', require('./post-toolbar/filters/filter-unlocked-on-top.directive.js'))

// Filters
.service('PostFilters', require('./post-toolbar/post-filters.service.js'))
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

.directive('savedSearchEditor', require('./savedsearches/editor-directive.js'))
.directive('savedSearchCreate', require('./savedsearches/create-directive.js'))
.directive('savedSearchUpdate', require('./savedsearches/update-directive.js'))
.directive('savedSearchModal', require('./savedsearches/saved-search-modal.directive.js'))
.directive('savedSearchListEditorModal', require('./savedsearches/saved-search-list-editor-modal.directive.js'))

.directive('savedSearchModeContext', require('./savedsearches/mode-context.directive.js'))

.service('CollectionsService', require('./collections/collections.service.js'))
.directive('collectionModeContext', require('./collections/mode-context.directive.js'))
.directive('collectionEditor', require('./collections/editor.directive.js'))
.directive('collectionListing', require('./collections/listing.directive.js'))

.config(require('./posts-routes.js'))
