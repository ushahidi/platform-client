angular.module('ushahidi.activity', [])

.config(require('./activity-routes.js'))

.directive('activityTimeline', require('./activity-timeline.directive.js'))
.directive('activityBarChart', require('./bar-chart.directive.js'))
.directive('activityTimeChart', require('./time-chart.directive.js'))
;
