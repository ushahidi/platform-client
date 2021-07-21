angular.module('ushahidi.map', [])

// Map view
.directive('postViewMap', require('./post-view-map.directive.js'))

// Mode context
.directive('modeContext', require('./mode-context/mode-context.directive.js'))
.directive('modeContextFormFilter', require('./mode-context/mode-context-form-filter.directive.js'))
.directive('filterBySurveyDropdown', require('./mode-context/filter-by-survey-dropdown.directive.js'))
.directive('filterByDatasource', require('./mode-context/filter-by-datasource.directive.js'))

// Add post
.directive('addPostButton', require('./post-toolbar/add-post/add-post-button.directive.js'))
.directive('addPostSurveyList', require('./post-toolbar/add-post/add-post-survey-list.directive.js'))

// Post toolbar
.directive('postToolbar', require('./post-toolbar/post-toolbar.directive.js'))
.directive('filterPosts', require('./post-toolbar/filter-posts.directive.js'))
.directive('sortAndFilterCounter', require('./post-toolbar/sort-and-filter-counter.directive.js'))

// Share
.directive('postShare', require('./post-toolbar/share/post-share.directive.js'))
.directive('shareMenu', require('./post-toolbar/share/share-menu.directive.js'))
.directive('shareMenuModal', require('./post-toolbar/share/share-menu-modal.directive.js'))
.directive('postExport', require('./post-toolbar/share/post-export.directive.js'))

.config(require('./map-routes.js'))

.run(['Leaflet', function (L) {
    L.Icon.Default.imagePath = '/img';
}]);