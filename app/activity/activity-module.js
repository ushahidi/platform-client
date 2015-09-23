angular.module('ushahidi.activity', ['dc'])

.config(require('./activity-routes.js'))

.service('PostEndpoint', require('../post/services/endpoints/post-endpoint.js'))

.directive('activityTimeline', require('./directives/activity-timeline-directive.js'));
