angular.module('ushahidi.main', [
    'ushahidi.posts',
    'ushahidi.activity',
    'ushahidi.donation'
]);

require('./posts/posts-module.js');
require('./activity/activity-module.js')
require('./donation/donation-module.js');
