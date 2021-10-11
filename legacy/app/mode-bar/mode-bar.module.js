angular.module('ushahidi.modebar', [])

.directive('modeBar', require('./mode-bar.directive.js'))
.directive('ushLogo', require('./ush-logo.directive.js'))

.run([
    '$templateCache',
    function ($templateCache) {
        $templateCache.put(
            'mode-bar/ushahidi-logo.html',
            require('./ushahidi-logo.html')
        );
    }
]);
