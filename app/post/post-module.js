angular.module('posts', [])

.directive('postViewTabs', require('./directives/post-view-tabs-directive.js'))
.directive('postViewFilters', require('./directives/post-view-filters-directive.js'))
.directive('postPreview', require('./directives/post-preview-directive.js'))
.directive('postValue', require('./directives/post-value-directive.js'))
.directive('postLocation', require('./directives/post-location-directive.js'))

.service('PostEndpoint', require('./services/endpoints/post-endpoint.js'))
.service('PostEntity', require('./services/entities/post-entity.js'))

.controller('PostModifyController', require('./controllers/post-modify-controller.js'))

.config(require('./post-routes.js'))

.run(['$window', function ($window) {
    $window.L.Icon.Default.imagePath = '/img';
}]);
