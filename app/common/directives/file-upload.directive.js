module.exports = FileUpload;
// import Upload from 'ng-file-upload';
function FileUpload() {
    return {
        restrict: 'E',
        template: require('./file-upload.html'),
        replace: true,
        scope: {
            container: '=',
            model: '=',
            validation: '=',
            showAdd: '&'
        },
        controller: [
            '$scope', '$attrs', 'Notify', 'Upload',
            function (
                $scope, $attrs, Notify, Upload
            ) {
                $scope.required = typeof $attrs.required !== 'undefined';

                $scope.uploadFile = function (picFile, dataurl) {
                    Upload.resize(picFile, {quality: 0.7}).then(function (resizedFile) {
                        $scope.container.file = resizedFile;
                        Upload.base64DataUrl(resizedFile).then(function (dataURL) {
                            $scope.container.dataURI = dataURL;
                            $scope.container.changed = true;
                            $scope.container.deleted = false;
                            $scope.model = 'changed';
                            // When I add the scope.apply it says digest already in progress.
                            // I think this makes sense if changes are being reflected back already?
                            // $scope.$apply();
                        })
                    })
                    if (validateFile($scope.container.file)) {
                        // $scope.container.file = $event.target.files[0];
                        // var reader = new FileReader();
                        // reader.onload = function () {
                        //     var dataURL = reader.result;
                        //     $scope.container.dataURI = dataURL;
                        // };
                        // reader.readAsDataURL($event.target.files[0]);
                    } else {
                        Notify.error('post.media.error_in_upload');
                    }
                };

                function validateFile(container) {
                    if ($scope.validation === 'image') {
                        var mimeReg = /[\/.](gif|jpg|jpeg|png)$/i;
                        var mimeCheck = mimeReg.test(container.type);
                        var sizeCheck = container.size < 1048576;
                        return mimeCheck && sizeCheck;
                    }
                    return true;
                }
            }]
    };
}
