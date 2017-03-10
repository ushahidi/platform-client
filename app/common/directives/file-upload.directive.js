module.exports = FileUpload;

function FileUpload() {
    return {
        restrict: 'E',
        template: require('./file-upload.html'),
        replace: true,
        scope: {
            container: '=',
            model: '='
        },
        controller: [
            '$scope', '$attrs',
            function (
                $scope, $attrs
            ) {
                $scope.required = typeof $attrs.required !== 'undefined';
                $scope.uploadFile = function ($event) {
                    $scope.container.file = $event.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function () {
                        var dataURL = reader.result;
                        $scope.container.dataURI = dataURL;
                        $scope.container.changed = true;
                        $scope.container.deleted = false;
                        $scope.model = 'changed';
                        $scope.$apply();
                    };
                    reader.readAsDataURL($event.target.files[0]);


                };
            }]
    };
}
