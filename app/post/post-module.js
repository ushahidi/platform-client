angular.module('ushahidi.posts', [])

.directive('postCard', require('./directives/post-card-directive.js'))
.directive('postActions', require('./directives/post-actions-directive.js'))
.directive('postMetadata', require('./directives/post-metadata.directive.js'))
.directive('postMessages', require('./directives/post-messages-directive.js'))
.directive('postAddForm', require('./directives/post-add-form-directive.js'))
.directive('postValue', require('./directives/post-value-directive.js'))
.directive('postLocation', require('./directives/post-location-directive.js'))
.directive('postRelation', require('./directives/post-relation-directive.js'))
.directive('postMedia', require('./directives/post-media-directive.js'))
.directive('postDatetime', require('./directives/post-datetime-value.js'))
.directive('postMediaValue', require('./directives/post-media-value-directive.js'))
.directive('postPreviewMedia', require('./directives/post-preview-media-directive.js'))
// Post editing workflows
.directive('postEditor', require('./directives/post-editor.directive.js'))
.directive('postChooseForm', require('./directives/post-choose-form-directive.js'))
.directive('postValueEdit', require('./directives/post-value-edit.directive.js'))
.directive('postTabs', require('./directives/post-tabs.directive.js'))
// Views
.directive('postView', require('./views/post-view.directive.js'))
.directive('postViewList', require('./views/post-view-list.directive.js'))
.directive('postViewMap', require('./views/post-view-map.directive.js'))
.directive('addPostButton', require('./views/add-post-button.directive.js'))
.directive('addPostTextButton', require('./views/add-post-text-button.directive.js'))
.directive('filterPosts', require('./views/filters/filter-posts.directive.js'))
.directive('modeContextFormFilter', require('./views/mode-context-form-filter.directive.js'))
.directive('postToolbar', require('./views/post-toolbar.directive.js'))
.directive('filterCategory', require('./views/filters/filter-category.directive.js'))
.directive('filterDate', require('./views/filters/filter-date.directive.js'))
.directive('filterForm', require('./views/filters/filter-form.directive.js'))
.directive('filterVisibleTo', require('./views/filters/filter-visible-to.directive.js'))
.directive('filterLocation', require('./views/filters/filter-location.directive.js'))
.directive('postActiveFilters', require('./views/filters/active-filters.directive.js'))
// Export
.directive('postExport', require('./export/post-export-directive.js'))

.service('PostFilters', require('./views/post-filters.service.js'))

.directive('postViewUnavailable', require('./views/post-view-unavailable.directive.js'))

.service('PostEndpoint', require('./services/endpoints/post-endpoint.js'))
.service('PostEntity', require('./services/entities/post-entity.js'))

.service('PostEditService', require('./services/post-edit-service.js'))
.service('PostActionsService', require('./services/post-actions-service.js'))
.service('PostViewService', require('./services/post-view.service.js'))

.config(require('./post-routes.js'))

.run(['$window', function ($window) {
    $window.L.Icon.Default.imagePath = '/img';
}]);
