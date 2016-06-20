angular.module('ushahidi.posts', [])

// Shared directives + services
.directive('postActions', require('./shared/post-actions.directive.js'))
.directive('postMetadata', require('./shared/post-metadata.directive.js'))

// Detail Screen
.directive('postMessages', require('./detail/post-messages.directive.js'))
.directive('postAddForm', require('./detail/post-add-form.directive.js'))
.directive('postValue', require('./detail/post-value.directive.js'))
.directive('postMediaValue', require('./detail/post-media-value.directive.js'))
.service('PostActionsService', require('./shared/post-actions.service.js'))

// Create / Edit Screens
.service('PostEntity', require('./modify/post-entity.service.js'))
.service('PostEditService', require('./modify/post-edit.service.js'))
.directive('postMedia', require('./modify/post-media.directive.js'))
.directive('postDatetime', require('./modify/post-datetime-value.directive.js'))
.directive('postLocation', require('./modify/post-location.directive.js'))
.directive('postRelation', require('./modify/post-relation.directive.js'))

// Post editing workflows
.directive('postEditor', require('./modify/post-editor.directive.js'))
.directive('postValueEdit', require('./modify/post-value-edit.directive.js'))
.directive('postTabs', require('./modify/post-tabs.directive.js'))

// Timeline and Map screen
.service('PostViewService', require('./views/post-view.service.js'))
.directive('postView', require('./views/post-view.directive.js'))
.directive('postViewList', require('./views/post-view-list.directive.js'))
.directive('postViewMap', require('./views/post-view-map.directive.js'))
.directive('postCard', require('./views/post-card.directive.js'))
.directive('postPreviewMedia', require('./views/post-preview-media.directive.js'))
.directive('addPostButton', require('./views/add-post-button.directive.js'))
.directive('addPostTextButton', require('./views/add-post-text-button.directive.js'))
.directive('modeContextFormFilter', require('./views/mode-context-form-filter.directive.js'))
.directive('postToolbar', require('./views/post-toolbar.directive.js'))
// Filters
.directive('filterPosts', require('./views/filters/filter-posts.directive.js'))
.directive('filterCategory', require('./views/filters/filter-category.directive.js'))
.directive('filterDate', require('./views/filters/filter-date.directive.js'))
.directive('filterForm', require('./views/filters/filter-form.directive.js'))
.directive('filterVisibleTo', require('./views/filters/filter-visible-to.directive.js'))
.directive('filterLocation', require('./views/filters/filter-location.directive.js'))
.directive('postActiveFilters', require('./views/filters/active-filters.directive.js'))
.directive('postExport', require('./views/post-export.directive.js'))
.service('PostFilters', require('./views/post-filters.service.js'))
// @todo move elsewhere? Used in post-view and activity
.directive('postViewUnavailable', require('./views/post-view-unavailable.directive.js'))

.config(require('./post-routes.js'))

.run(['$window', function ($window) {
    $window.L.Icon.Default.imagePath = '/img';
}]);
