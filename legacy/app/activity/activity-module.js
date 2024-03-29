export const ACTIVITY_MODULE = angular.module('ushahidi.activity', [])

.directive('activityTimeline', require('./activity-timeline.directive.js'))
.directive('activityBarChart', require('./bar-chart.directive.js'))
.directive('activityTimeChart', require('./time-chart.directive.js'))
.directive('targetedSurveyTable', require('./targeted-survey-table.directive.js'))
.directive('crowdsourcedSurveyTable', require('./crowdsourced-survey-table.directive.js'))
;
