angular.module('ushahidi.posts', [])

.directive('postViewTabs', require('./directives/post-view-tabs-directive.js'))
.directive('postViewFilters', require('./directives/post-view-filters-directive.js'))
.directive('postActiveFilters', require('./directives/post-active-filters-directive.js'))
.directive('postPreview', require('./directives/post-preview-directive.js'))
.directive('postValue', require('./directives/post-value-directive.js'))
.directive('postLocation', require('./directives/post-location-directive.js'))
.directive('postRelation', require('./directives/post-relation-directive.js'))
// Post editing workflows
.directive('postEditor', require('./directives/post-editor-directive.js'))
.directive('postChooseForm', require('./directives/post-choose-form-directive.js'))
// Views
.directive('postView', require('./directives/views/post-view-directive.js'))
.directive('postViewMap', require('./directives/views/post-view-map-directive.js'))
.directive('postViewList', require('./directives/views/post-view-list-directive.js'))
.directive('postViewTimeline', require('./directives/views/post-view-timeline-directive.js'))
.directive('postViewChart', require('./directives/views/post-view-chart-directive.js'))

.service('PostEndpoint', require('./services/endpoints/post-endpoint.js'))
.service('PostEntity', require('./services/entities/post-entity.js'))

.config(require('./post-routes.js'))

.run(['$window', function ($window) {
    $window.L.Icon.Default.imagePath = '/img';
}]);
