module.exports = [
    '$scope',
    'Authentication',
function(
    $scope,
    Authentication
) {
    $scope.logoutClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        Authentication.logout();
    };
}];
