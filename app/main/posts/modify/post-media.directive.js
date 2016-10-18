module.exports = [
    '$http',
    'MediaEndpoint',
    'Util',
    'Notify',
    '$q',
function (
    $http,
    MediaEndpoint,
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
            name: '@'
        },
        templateUrl: 'templates/main/posts/modify/media.html',
        link: function ($scope, element, attr, formCtrl) {
            // Initialize file container
            $scope.fileContainer = {file: null};

            // Initialize media object
            $scope.media = {};

            $scope.uploadFile = uploadFile;
            $scope.deleteMedia = deleteMedia;

            activate();

            function activate() {
                getMedia();
            }

            function getMedia() {
                if ($scope.mediaId) {
                    MediaEndpoint.get({id: $scope.mediaId}).$promise.then(function (media) {
                        $scope.media = media;
                    });
                }
            }

            // Never called
            function updateCaption() {
                return MediaEndpoint.update({id: $scope.mediaId, caption: $scope.media.caption }).$promise.then(function (result) {}, function (error) {
                    Notify.apiErrors(error);
                });
            }

            function uploadFile() {
                if (!$scope.fileContainer.file) {
                    return;
                }

                // Delete current file
                var promise = clearCurrentMedia($scope.mediaId);

                // ...then upload new file
                promise.then(function () {
                    var formData = new FormData();

                    formData.append('file', $scope.fileContainer.file);

                    if ($scope.media.caption) {
                        formData.append('caption', $scope.media.caption);
                    }

                    $http.post(
                        Util.apiUrl('/media'),
                        formData,
                        {
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    ).then(function (response) {
                        $scope.mediaId = response.data.id;
                        $scope.getMedia();

                        // We found a file so change the state of parent form
                        formCtrl[$scope.name].$setDirty();
                    }, function (error) {
                        Notify.apiErrors(error);
                    });
                }, function (error) {
                    Notify.apiErrors(error);
                });
            }

            function clearCurrentMedia(mediaId) {
                // Delete previous media first
                if (mediaId) {
                    return MediaEndpoint.delete({id: mediaId}).$promise;
                }

                // Return a promise anyway if there is no media to delete
                return $q.when();
            }

            function deleteMedia(mediaId) {
                if (mediaId) {
                    MediaEndpoint.delete({id: mediaId}).$promise.then(function (result) {
                        $scope.mediaId = undefined;
                        $scope.media = {};
                    }, function (error) {
                        Notify.apiErrors(error);
                    });
                }
            }
        }
    };
}];
