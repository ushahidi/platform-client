angular.module('ushahidi.main', [
    'ushahidi.data',
    'ushahidi.posts',
    'ushahidi.donation'
]);

require('./data/data-module.js');
require('./posts/posts-module.js');
require('./donation/donation-module.js');
