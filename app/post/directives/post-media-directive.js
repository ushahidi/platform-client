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
        templateUrl: 'templates/posts/media.html',
        link: function ($scope, element, attr, formCtrl) {
            // Initialize file container
            $scope.fileContainer = {file: null};

            // Initialize media object
            $scope.media = {};

            if ($scope.mediaId) {
                MediaEndpoint.get({id: $scope.mediaId}).$promise.then(function (media) {
                    $scope.media = media;
                });
            }

            // Track file changes
            $scope.canUpload = false;

            $scope.onChange = function () {
                $scope.$apply(function () {
                    if ($scope.fileContainer.file) {
                        $scope.canUpload = true;
                    } else {
                        $scope.canUpload = false;
                    }
                });
            };

            $scope.uploadFile = function () {
                //@todo Allow editing of caption for existing image
                if (!$scope.fileContainer.file) {
                    return;
                }

                // Delete current file
                var promise = deleteMedia($scope.mediaId);

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

                        // We found a file so change the state of parent form
                        formCtrl[$scope.name].$setDirty();
                    }, function (error) {
                        Notify.apiErrors(error);
                    });
                }, function (error) {
                    Notify.apiErrors(error);
                });
            };

            var deleteMedia = function (mediaId) {
                // Delete previous media first
                if (mediaId) {
                    return MediaEndpoint.delete({id: mediaId}).$promise;
                }

                // Return a promise anyway if there is no media to delete
                return $q.when();
            };
        }
    };
}];
