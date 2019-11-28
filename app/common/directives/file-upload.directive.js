module.exports = FileUpload;

function FileUpload() {
    return {
        restrict: 'E',
        template: require('./file-upload.html'),
        replace: true,
        scope: {
            container: '=',
            model: '=',
            validation: '='
        },
        controller: [
            '$scope', '$attrs', 'Notify',
            function (
                $scope, $attrs, Notify
            ) {
                $scope.required = typeof $attrs.required !== 'undefined';
                $scope.uploadFile = function ($event) {
                    if (validateFile($event.target.files[0])) {
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
                    } else {
                        Notify.error('post.media.error_in_upload');
                    }
                };

                function validateFile(container) {
                    if ($scope.validation === 'image') {
                        var mimeReg = /[\/.](gif|jpg|jpeg|png)$/i;
                        var mimeCheck = mimeReg.test(container.type);
                        var sizeCheck = container.size < 1000000;
                        return mimeCheck && sizeCheck;
                    }
                    return true;
                }
            }]
    };
}
