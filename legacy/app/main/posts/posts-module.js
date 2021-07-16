angular.module('ushahidi.posts', [])

// Shared directives + services
.directive('postActions', require('./data/common/post-actions.directive.js'))
.directive('postMetadata', require('./data/common/post-metadata.directive.js'))
.service('PostMetadataService', require('./data/common/post-metadata.service.js'))
.service('PostSurveyService', require('./data/common/post-survey.service.js'))

// Post Locking
.service('PostLockService', require('./data/common/post-lock.service.js'))
.directive('postLock', require('./data/common/post-lock.directive.js'))

// Detail Screen
.directive('postMessages', require('./detail/post-messages.directive.js'))
.directive('postAddForm', require('./detail/post-add-form.directive.js'))
.directive('postValue', require('./detail/post-value.directive.js'))
.directive('postMediaValue', require('./detail/post-media-value.directive.js'))
.directive('postVideoView', require('./detail/post-video-value.directive.js'))
.directive('postDetailMap', require('./detail/map.directive.js'))
.directive('postDetailData', require('./detail/post-detail-data.directive.js'))
.directive('postCategoryValue', require('./detail/post-category-value.directive.js'))
.service('PostActionsService', require('./data/common/post-actions.service.js'))

// Create / Edit Screens
.service('PostEntity', require('./modify/post-entity.service.js'))
.service('PostEditService', require('./modify/post-edit.service.js'))
.service('MediaEditService', require('./modify/media-edit.service.js'))
.directive('postMedia', require('./modify/post-media.directive.js'))
.directive('postVideoInput', require('./modify/post-video.directive.js'))
.directive('postDatetime', require('./modify/post-datetime-value.directive.js'))
.directive('postLocation', require('./modify/location.directive.js'))
.directive('postRelation', require('./modify/post-relation.directive.js'))

// Post editing workflows
.directive('postEditor', require('./modify/post-editor.directive.js'))
.directive('postValueEdit', require('./modify/post-value-edit.directive.js'))
.directive('postCategoryEditor', require('./modify/post-category-editor.js'))
.directive('postTabs', require('./modify/post-tabs.directive.js'))
.directive('postToolbox', require('./modify/post-toolbox.directive.js'))
.directive('filterPostSortingOptions', require('./views/post-toolbar/filters/filter-post-sorting-options.directive.js'))
.directive('filterPostOrderAscDesc', require('./views/post-toolbar/filters/filter-post-order-asc-desc.directive.js'))
.directive('filterUnlockedOnTop', require('./views/post-toolbar/filters/filter-unlocked-on-top.directive.js'))
.directive('postDataEditor', require('./modify/post-data-editor.directive.js'))
.directive('surveyLanguageSelector', require('./data/common/survey-language-selector.directive.js'))
.directive('postTranslationEditor', require('./modify/post-translation-editor.directive.js'))
// Timeline, data and Map screen
.service('PostViewService', require('./views/post-view.service.js'))
.directive('postViewMap', require('./views/map/post-view-map.directive.js'))
.directive('postCard', require('./data/views/post-card.directive.js'))
.directive('postPreviewMedia', require('./data/views/post-preview-media.directive.js'))
.directive('addPostButton', require('./views/post-toolbar/add-post-button.directive.js'))
.directive('addPostSurveyList', require('./views/post-toolbar/add-post-survey-list.directive.js'))
.directive('addPostTextButton', require('./views/post-toolbar/add-post-text-button.directive.js'))
.directive('modeContext', require('./views/map/mode-context.directive.js'))
.directive('modeContextFormFilter', require('./views/map/mode-context-form-filter.directive.js'))
.directive('filterBySurveyDropdown', require('./views/map/filter-by-survey-dropdown.directive.js'))
.directive('postToolbar', require('./views/post-toolbar/post-toolbar.directive.js'))
.directive('filterByDatasource', require('./views/map/filter-by-datasource.directive.js'))
.directive('postViewData', require('./data/views/post-view-data.directive.js'))
// Filters
.directive('filterPosts', require('./views/post-toolbar/filters/filter-posts.directive.js'))
.directive('filterCategory', require('./views/post-toolbar/filters/filter-category.directive.js'))
.directive('filterDate', require('./views/post-toolbar/filters/filter-date.directive.js'))
.directive('filterForm', require('./views/post-toolbar/filters/filter-form.directive.js'))
.directive('filterVisibleTo', require('./views/post-toolbar/filters/filter-visible-to.directive.js'))
.directive('filterStatus', require('./views/post-toolbar/filters/filter-status.directive.js'))
.directive('filterSource', require('./views/post-toolbar/filters/filter-source.directive.js'))
.directive('filterLocation', require('./views/post-toolbar/filters/filter-location.directive.js'))
.directive('filterHasLocation', require('./views/post-toolbar/filters/filter-has-location.directive.js'))
.directive('postActiveSearchFilters', require('./views/post-toolbar/filters/active-search-filters.directive.js'))
.service('PostFilters', require('./views/post-toolbar/post-filters.service.js'))
.service('FilterTransformers', require('./views/post-toolbar/filters/filter-transformers.service.js'))
.directive('filtersDropdown', require('./views/post-toolbar/filters/filters-dropdown.directive.js'))
.directive('filterSavedSearch', require('./views/post-toolbar/filters/filter-saved-search.directive.js'))
.directive('sortAndFilterCounter', require('./views/post-toolbar/filters/sort-and-filter-counter.directive.js'))
// Share
.directive('postShare', require('./views/post-toolbar/share/post-share.directive.js'))
.directive('shareMenu', require('./views/post-toolbar/share/share-menu.directive.js'))
.directive('shareMenuModal', require('./views/post-toolbar/share/share-menu-modal.directive.js'))
.directive('postExport', require('./views/post-toolbar/share/post-export.directive.js'))
// @todo move elsewhere? Used in post-view and activity
.directive('postViewUnavailable', require('./views/post-view-unavailable.directive.js'))


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
.directive('collectionToggleButton', require('./data/common/collection-toggle/collection-toggle-button.js'))
.directive('collectionToggleLink', require('./data/common/collection-toggle/collection-toggle-link.js'))

.config(require('./posts-routes.js'))

.run(['Leaflet', function (L) {
    L.Icon.Default.imagePath = '/img';
}])
;
