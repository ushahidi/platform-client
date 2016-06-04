angular.module('ushahidi.activity', [])

.config(require('./activity-routes.js'))

.directive('activityTimeline', require('./activity-timeline.directive.js'))
.directive('activityTimeChart', require('./bar-chart.directive.js'))
.directive('activityBarChart', require('./time-chart.directive.js'))
;
