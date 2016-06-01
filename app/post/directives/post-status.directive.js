module.exports = [
function (
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        templateUrl: 'templates/posts/modify/post-status.html',
        controller: [
            '$scope',
            '$translate',
        function (
            $scope,
            $translate
        ) {
            $scope.allowedChangeStatus = function () {
                return $scope.post.allowed_privileges && $scope.post.allowed_privileges.indexOf('change_status') !== -1;
            };
        }]
    };
}];
