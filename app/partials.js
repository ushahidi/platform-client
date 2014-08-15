require('angular/angular');
var fs = require('fs');

module.exports = angular.module('partials', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('partials/search-bar.html', fs.readFileSync(__dirname + '/templates/partials/search-bar.html', { encoding : 'utf8' }));
    }]);
