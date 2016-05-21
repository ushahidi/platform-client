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
.directive('postView', require('./directives/views/post-view-directive.js'))
.directive('postViewMap', require('./directives/views/post-view-map-directive.js'))
.directive('postViewList', require('./directives/views/post-view-list-directive.js'))
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
