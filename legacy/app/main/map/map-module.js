angular.module('ushahidi.map', [])

// Timeline, data and Map screen
.directive('postViewMap', require('./post-view-map.directive.js'))
.directive('modeContext', require('./mode-context.directive.js'))
.directive('modeContextFormFilter', require('./mode-context-form-filter.directive.js'))
.directive('filterBySurveyDropdown', require('./filter-by-survey-dropdown.directive.js'))
.directive('filterByDatasource', require('./filter-by-datasource.directive.js'))

.config(require('./map-routes.js'))