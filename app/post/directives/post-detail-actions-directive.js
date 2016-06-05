module.exports = [
    '$rootScope',
    '$translate',
    'PostEndpoint',
    'Notify',
    '$location',
function (
    $rootScope,
    $translate,
    PostEndpoint,
    Notify,
    $location
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        templateUrl: 'templates/posts/post-detail-actions.html',
        link: function ($scope) {
            $scope.showDropDown = false;
            $scope.toggleDropDown = function () {
                $scope.showDropDown = !$scope.showDropDown;
            };

            $scope.addToCollection = function (post) {
                $rootScope.$emit('collectionToggle:show', [post]);
            };

            $scope.delete = function (post) {
                $translate('notify.post.destroy_confirm').then(function (message) {
                    Notify.showConfirmAlert(message, false, 'Delete').then(function () {
                        PostEndpoint.delete({ id: post.id }).$promise.then(function () {
                            $translate('notify.post.destroy_success', {name: post.title})
                                .then(function (message) {
                                    Notify.showNotificationSlider(message);
                                    
                                    // Redirect to list view
                                    $location.path('/views/list');
                                });
                        }, function (errorResponse) {
                            Notify.showApiErrors(errorResponse);
                        });
                    });
                });  
            };
        }
    };
}];
