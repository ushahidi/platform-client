/*
 Lazy loads dc.js
*/
angular.module('dc', ['d3', 'crossfilter'])

.factory('dcService', [
    '$document',
    '$q',
    '$rootScope',
    'd3Service',
    'crossfilterService',
function (
    $document,
    $q,
    $rootScope,
    d3Service,
    crossfilterService
) {
    var d = $q.defer();
    d3Service.d3().then(function (d3) {
        crossfilterService.crossfilter().then(function (crossfilter) {
            function onScriptLoad() {
                // Load client in the browser
                window.crossfilter = null;
                $rootScope.$apply(function() { d.resolve(window.dc); });
            }
            // Create a script tag with d3 as the source
            // and call our onScriptLoad callback when it
            // has been loaded
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/dc/2.0.0-beta.18/dc.min.js';
            scriptTag.onreadystatechange = function () {
                if (this.readyState === 'complete') {
                onScriptLoad();
                }
            };
            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);
        });
    });
    return {
        dc: function() { return d.promise; }
    };
}]);
