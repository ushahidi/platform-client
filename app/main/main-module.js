angular.module('ushahidi.main', [
    'ushahidi.posts',
    'ushahidi.activity'
]);

require('./posts/posts-module.js');
require('./activity/activity-module.js');
