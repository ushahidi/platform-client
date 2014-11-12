module.exports = [
    '$rootScope',
    '$location',
function(
    $rootScope,
    $location
) {
    var path = function() {
        return $location.path();
    };

    $rootScope.$watch(path, function(newPath)
    {
        $rootScope.activePath = newPath;
    });
}];
