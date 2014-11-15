angular.module('posts', [])

.directive('postViewTabs', require('./directives/post-view-tabs-directive.js'))
.directive('postDetailTabs', require('./directives/post-detail-tabs-directive.js'))
.directive('postPreview', require('./directives/post-preview-directive.js'))

.service('PostEndpoint', require('./services/endpoints/post-endpoint.js'))
.service('PostEntity', require('./services/entities/post-entity.js'))

.controller('postMapView', require('./controllers/post-map-view-controller.js'))
.config(require('./post-routes.js'));
