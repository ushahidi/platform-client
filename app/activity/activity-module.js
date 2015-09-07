angular.module('ushahidi.activity', [])
.config(require('./activity-routes.js'))


.service('PostEndpoint', require('../post/services/endpoints/post-endpoint.js'));

