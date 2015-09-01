angular.module('ushahidi.activity', [])
.service('PostEndpoint', require('../post/services/endpoints/post-endpoint.js'))

.config(require('./activity-routes.js'));
