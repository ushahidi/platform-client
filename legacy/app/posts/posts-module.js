export const POSTS_MODULE = angular.module('ushahidi.posts', [])

// Post editing workflows
.directive('filterPostSortingOptions', require('./filters/filter-post-sorting-options.directive.js'))
.directive('filterPostOrderAscDesc', require('./filters/filter-post-order-asc-desc.directive.js'))
.directive('filterUnlockedOnTop', require('./filters/filter-unlocked-on-top.directive.js'))

// Filters
.directive('filterCategory', require('./filters/filter-category.directive.js'))
.directive('filterDate', require('./filters/filter-date.directive.js'))
.directive('filterForm', require('./filters/filter-form.directive.js'))
.directive('filterVisibleTo', require('./filters/filter-visible-to.directive.js'))
.directive('filterStatus', require('./filters/filter-status.directive.js'))
.directive('filterSource', require('./filters/filter-source.directive.js'))
.directive('filterLocation', require('./filters/filter-location.directive.js'))
.directive('filterHasLocation', require('./filters/filter-has-location.directive.js'))
.directive('postActiveSearchFilters', require('./filters/active-search-filters.directive.js'))
.service('FilterTransformers', require('./filters/filter-transformers.service.js'))
.directive('filtersDropdown', require('./filters/filters-dropdown.directive.js'))
.directive('filterSavedSearch', require('./filters/filter-saved-search.directive.js'))


.directive('savedSearchEditor', require('./savedsearches/editor-directive.js'))
.directive('savedSearchCreate', require('./savedsearches/create-directive.js'))
.directive('savedSearchUpdate', require('./savedsearches/update-directive.js'))
.directive('savedSearchModal', require('./savedsearches/saved-search-modal.directive.js'))
.directive('savedSearchListEditorModal', require('./savedsearches/saved-search-list-editor-modal.directive.js'))

.directive('savedSearchModeContext', require('./savedsearches/mode-context.directive.js'))

.directive('collectionModeContext', require('./collections/mode-context.directive.js'))
.directive('collectionEditor', require('./collections/editor.directive.js'))
.directive('collectionListing', require('./collections/listing.directive.js'))