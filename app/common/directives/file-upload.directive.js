module.exports = FileUpload;

function FileUpload() {
    return {
        restrict: 'E',
        templateUrl: 'templates/common/directives/file-upload.html',
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
}
