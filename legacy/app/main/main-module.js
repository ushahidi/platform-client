angular.module('ushahidi.main', [
    'ushahidi.map',
    'ushahidi.data',
    'ushahidi.posts',
    'ushahidi.donation'
]);

require('./map/map-module.js');
require('./data/data-module.js');
require('./posts/posts-module.js');
require('./donation/donation-module.js');
