angular.module('ushahidi.main', [
    'ushahidi.posts',
    'ushahidi.donation'
]);

require('./posts/posts-module.js');
require('./donation/donation-module.js');
