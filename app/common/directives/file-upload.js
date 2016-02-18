angular.module('ushahidi.common.file-upload', [])

.directive('fileUpload', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/file-upload/file-upload.html',
        scope: {
            fileContainer: '='
        },

        controller: [
            '$scope', '$attrs',
            function (
                $scope, $attrs
            ) {
                $scope.required = typeof $attrs.required !== 'undefined';
                $scope.uploadFile = function ($event) {
                    $scope.fileContainer.file = $event.target.files[0];
                };
            }]
    };
});
