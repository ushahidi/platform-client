module.exports = [
    '$http',
    'MediaEndpoint',
    'MediaEditService',
    'Util',
    'Notify',
    '$q',
function (
    $http,
    MediaEndpoint,
    MediaEditService,
    Util,
    Notify,
    $q
) {
    return {
        restrict: 'E',
        replace: true,
        require: '^^form',
        scope: {
            mediaId: '=',
            media: '=',
            name: '@'
        },
        template: require('./media.html'),
        link: function ($scope, element, attr, formCtrl) {

            if ($scope.mediaId) {
                MediaEndpoint.get({id: $scope.mediaId}).$promise.then(function (media) {
                    $scope.media = media;
                    // Set initial media state
                    $scope.media.changed = false;
                });
            } else {
                // Initialize media object
                $scope.media = {file: null, caption: null, dataURI: null, changed: false};
            }

            $scope.showAdd = function () {
                return (!$scope.media.id && !$scope.media.changed || $scope.media.deleted);
            };

            $scope.showReplace = function () {
                return $scope.media.dataURI || $scope.media.id;
            };

            $scope.showDelete = function () {
                return $scope.media.id;
            };

            $scope.deleteMedia = function (mediaId) {
                // Mark for deletion
                Notify.confirmDelete('notify.post.delete_image_confirm').then(function () {
                    MediaEditService.deleteMedia(mediaId).then(function () {
                        $scope.media = {};
                        $scope.media.changed = true;
                        $scope.media.deleted = true;
                        $scope.mediaId = null;
                    });
                });
            };
        }
    };
}];
