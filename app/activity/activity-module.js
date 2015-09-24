angular.module('ushahidi.activity', [])

.config(require('./activity-routes.js'))

.directive('activityTimeline', require('./directives/activity-timeline-directive.js'));
