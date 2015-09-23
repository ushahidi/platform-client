/*
 Lazy loads crossfilter lib [a dependency for dc.js]
*/
angular.module('crossfilter', [])

.factory('crossfilterService', [
    '$document',
    '$q',
    '$rootScope',
function (
    $document,
    $q,
    $rootScope
) {
    var d = $q.defer();

    function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() { d.resolve(window.crossfilter); });
    }
    // Create a script tag with d3 as the source
    // and call our onScriptLoad callback when it
    // has been loaded
    var scriptTag = $document[0].createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = 'https://cdnjs.cloudflare.com/ajax/libs/crossfilter/1.3.12/crossfilter.min.js';
    scriptTag.onreadystatechange = function () {
        if (this.readyState === 'complete') {
        onScriptLoad();
        }
    };
    scriptTag.onload = onScriptLoad;

    var s = $document[0].getElementsByTagName('body')[0];
    s.appendChild(scriptTag);

    return {
        crossfilter: function() { return d.promise; }
    };
}]);
