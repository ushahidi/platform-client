angular.module('ushahidi.posts', [])

// Shared directives + services
.directive('postActions', require('./common/post-actions.directive.js'))
.directive('postMetadata', require('./common/post-metadata.directive.js'))
.service('PostMetadataService', require('./common/post-metadata.service.js'))
.service('PostSurveyService', require('./common/post-survey.service.js'))

// Detail Screen
.directive('postMessages', require('./detail/post-messages.directive.js'))
.directive('postAddForm', require('./detail/post-add-form.directive.js'))
.directive('postValue', require('./detail/post-value.directive.js'))
.directive('postMediaValue', require('./detail/post-media-value.directive.js'))
.directive('postVideoView', require('./detail/post-video-value.directive.js'))
.directive('postDetailMap', require('./detail/map.directive.js'))
.service('PostActionsService', require('./common/post-actions.service.js'))

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
.directive('postTabs', require('./modify/post-tabs.directive.js'))
.directive('postToolbox', require('./modify/post-toolbox.directive.js'))
.directive('postTimelineToolbox', require('./views/post-timeline-toolbox.directive.js'))

// Timeline and Map screen
.service('PostViewService', require('./views/post-view.service.js'))
.directive('postView', require('./views/post-view.directive.js'))
.directive('postViewList', require('./views/post-view-list.directive.js'))
.directive('postViewMap', require('./views/post-view-map.directive.js'))
.directive('postViewCreate', require('./views/post-view-create.directive.js'))
.directive('postCard', require('./views/post-card.directive.js'))
.directive('postPreviewMedia', require('./views/post-preview-media.directive.js'))
.directive('addPostButton', require('./views/add-post-button.directive.js'))
.directive('addPostSurveyList', require('./views/add-post-survey-list.directive.js'))
.directive('addPostTextButton', require('./views/add-post-text-button.directive.js'))
.directive('modeContextFormFilter', require('./views/mode-context-form-filter.directive.js'))
.directive('filterBySurvey', require('./views/filter-by-survey.directive.js'))
.directive('filterBySurveyDropdown', require('./views/filter-by-survey-dropdown.directive.js'))
.directive('postToolbar', require('./views/post-toolbar.directive.js'))
// Filters
.directive('filterPosts', require('./views/filters/filter-posts.directive.js'))
.directive('filterCategory', require('./views/filters/filter-category.directive.js'))
.directive('filterDate', require('./views/filters/filter-date.directive.js'))
.directive('filterForm', require('./views/filters/filter-form.directive.js'))
.directive('filterVisibleTo', require('./views/filters/filter-visible-to.directive.js'))
.directive('filterStatus', require('./views/filters/filter-status.directive.js'))
.directive('filterLocation', require('./views/filters/filter-location.directive.js'))
.directive('filterHasLocation', require('./views/filters/filter-has-location.directive.js'))
.directive('postActiveFilters', require('./views/filters/active-filters.directive.js'))
.service('PostFilters', require('./views/post-filters.service.js'))
.directive('filterModal', require('./views/filters/filter-modal.directive.js'))
// Share
.directive('postShare', require('./views/share/post-share.directive.js'))
.directive('shareMenu', require('./views/share/share-menu.directive.js'))
.directive('shareMenuModal', require('./views/share/share-menu-modal.directive.js'))
.directive('postExport', require('./views/share/post-export.directive.js'))
// @todo move elsewhere? Used in post-view and activity
.directive('postViewUnavailable', require('./views/post-view-unavailable.directive.js'))


.directive('savedSearchEditor', require('./savedsearches/editor-directive.js'))
.directive('savedSearchCreate', require('./savedsearches/create-directive.js'))
.directive('savedSearchUpdate', require('./savedsearches/update-directive.js'))
.directive('savedSearchModal', require('./savedsearches/saved-search-modal.directive.js'))
.directive('savedSearchModeContext', require('./savedsearches/mode-context.directive.js'))

.service('CollectionsService', require('./collections/collections.service.js'))
.directive('collectionModeContext', require('./collections/mode-context.directive.js'))
.directive('collectionEditor', require('./collections/editor.directive.js'))
.directive('collectionListing', require('./collections/listing.directive.js'))

.directive('collectionToggleButton', require('./common/collection-toggle/collection-toggle-button.js'))
.directive('collectionToggleLink', require('./common/collection-toggle/collection-toggle-link.js'))


.config(require('./posts-routes.js'))

.run(['Leaflet', function (L) {
    L.Icon.Default.imagePath = '/img';
}])
;
