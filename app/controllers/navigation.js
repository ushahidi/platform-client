module.exports = [
    '$scope',
    'Authentication',
function(
    $scope,
    Authentication
) {
    $scope.logoutClick = function() {
        event.preventDefault();
        event.stopPropagation();
        Authentication.logout();
    };
}];
