module.exports = [
    '$scope',
    '$translate',
function(
    $scope,
    $translate
) {
    $translate('workspace.recent_activity').then(function(title) {
        $scope.title = title;
    });
}];
