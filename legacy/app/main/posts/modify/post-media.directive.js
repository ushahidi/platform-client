module.exports = [
    '$http',
    'MediaEndpoint',
    'MediaEditService',
    'Util',
    'Notify',
    '$q',
    '_',
function (
    $http,
    MediaEndpoint,
    MediaEditService,
    Util,
    Notify,
    $q,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        scope: {
            media: '=',
            name: '@',
            mediaHasCaption: '<'
        },
        template: require('./media.html'),
        link: function ($scope, element, attr, ngModel) {
            // Initialize media object
            $scope.media = { id: null, file: null, caption: '', dataURI: null, changed: false, deleted: false };
            $scope.mediaId = null;
            $scope.showAdd = showAdd;
            $scope.showReplace = showReplace;
            $scope.showDelete = showDelete;
            $scope.deleteMedia = deleteMedia;

            activate();

            function activate() {
                renderViewValue();

                // Watch for media changes
                $scope.$watch('media.changed', handleMediaChange);

                // Watch for media changes
                $scope.$watch('mediaId', handleMediaIdChange);

                // Watch for deleted images
                $scope.$watch('media.deleted', handleMediaDeleted);

                // Set up rendering any model changes
                ngModel.$render = renderViewValue;
            }

            function renderViewValue() {
                if (ngModel.$viewValue) {
                    $scope.mediaId = parseInt(ngModel.$viewValue);
                    // Load the media from the API
                    if ($scope.media.id !== $scope.mediaId && _.isNumber($scope.mediaId)) {
                        MediaEndpoint.get({id: $scope.mediaId}).$promise.then(function (media) {
                            $scope.media = media;
                            // Set initial media state
                            $scope.media.changed = false;
                        });
                    }
                }
            }

            function handleMediaChange(changed) {
                if (changed) {
                    // Make sure the model is set dirty if media changes
                    ngModel.$setViewValue($scope.mediaId);
                    ngModel.$setDirty();
                }

            }

            function handleMediaIdChange(id) {
                if (id === 'changed') {
                    // Make sure the model is set dirty if media changes
                    ngModel.$setViewValue($scope.mediaId);
                    ngModel.$setDirty();
                }
            }

            function handleMediaDeleted(deleted) {
                // // Make sure we update the view-value both if an image is deleted and deleted and then replaced
                if (deleted) {
                    ngModel.$setViewValue(null);
                } else {
                    ngModel.$setViewValue($scope.mediaId);
                }
            }

            function showAdd() {
                return (!$scope.media.id && !$scope.media.changed || $scope.media.deleted);
            }

            function showReplace() {
                return $scope.media.dataURI || ($scope.media.id && !$scope.media.deleted);
            }

            function showDelete() {
                return $scope.media.id || ($scope.media.changed && !$scope.media.deleted);
            }

            function deleteMedia(mediaId) {
                // Mark for deletion
                $scope.media = {id: mediaId, changed: true, deleted: true};
            }
        }
    };
}];
