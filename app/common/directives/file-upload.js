angular.module('ushahidi.common.file-upload', [])

.directive('fileUpload', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/file-upload/file-upload.html',
        scope: {
            fileContainer: '='
        },

        controller: [
            '$scope',
            function (
                $scope
            ) {
                $scope.uploadFile = function ($event) {
                    $scope.fileContainer.file = $event.target.files[0];
                };
            }]
    };
});
