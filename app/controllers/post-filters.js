module.exports = [
    '$rootScope',
    '$scope',
    '$translate',
function(
    $rootScope,
    $scope,
    $translate
) {
    function getView() {
        var activePath = $rootScope.activePath.match(/views\/([^\/]+)/);
        if (activePath) {
            return activePath[1];
        }
        return 'map';
    }

    $translate('view_tabs.' + getView()).then(function(viewName) {
        $scope.activeView = viewName;
    });
}];
