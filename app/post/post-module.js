angular.module('ushahidi.posts', [])

.directive('postViewTabs', require('./directives/post-view-tabs-directive.js'))
.directive('postViewFilters', require('./directives/post-view-filters-directive.js'))
.directive('postActiveFilters', require('./directives/post-active-filters-directive.js'))
.directive('postCard', require('./directives/post-card-directive.js'))
.directive('postValue', require('./directives/post-value-directive.js'))
.directive('postLocation', require('./directives/post-location-directive.js'))
.directive('postRelation', require('./directives/post-relation-directive.js'))
.directive('postMedia', require('./directives/post-media-directive.js'))
.directive('postMediaValue', require('./directives/post-media-value-directive.js'))
.directive('postPreviewMedia', require('./directives/post-preview-media-directive.js'))
// Post editing workflows
.directive('postEditor', require('./directives/post-editor-directive.js'))
.directive('postChooseForm', require('./directives/post-choose-form-directive.js'))
.directive('postValueEdit', require('./directives/post-value-edit-directive.js'))
.directive('postStatus', require('./directives/post-status-directive.js'))
.directive('postStages', require('./directives/post-stages-directive.js'))
// Views
.directive('postView', require('./views/post-view.directive.js'))
.directive('postViewList', require('./views/post-view-list.directive.js'))
.directive('addPostButton', require('./views/add-post-button.directive.js'))
.directive('filterPosts', require('./views/filter-posts.directive.js'))
.directive('modeContextFormFilter', require('./views/mode-context-form-filter.directive.js'))
.directive('postToolbar', require('./views/post-toolbar.directive.js'))
.directive('categorySelect', require('./views/category-select.directive.js'))
.directive('dateSelect', require('./views/date-select.directive.js'))
.directive('formSelect', require('./views/form-select.directive.js'))
.directive('visibleToSelect', require('./views/visible-to-select.directive.js'))

.service('PostFilters', require('./views/post-filters.service.js'))

.directive('postViewMap', require('./directives/views/post-view-map-directive.js'))
.directive('postViewTimeline', require('./directives/views/post-view-timeline-directive.js'))
.directive('postViewChart', require('./directives/views/post-view-chart-directive.js'))
.directive('postViewUnavailable', require('./directives/views/post-view-unavailable-directive.js'))

.service('PostEndpoint', require('./services/endpoints/post-endpoint.js'))
.service('PostEntity', require('./services/entities/post-entity.js'))

.service('PostEditService', require('./services/post-edit-service.js'))

.config(require('./post-routes.js'))

.run(['$window', function ($window) {
    $window.L.Icon.Default.imagePath = '/img';
}]);
