module.exports = ImageUpload;
function ImageUpload() {
    return {
        restrict: 'E',
        template: require('./image-upload.html'),
        replace: true,
        scope: {
            container: '=',
            model: '=',
            validation: '=',
            showAddPhoto: '=',
            showReplacePhoto: '='
        },
        controller: [
            '$scope', '$attrs', 'Notify', 'Upload',
            function (
                $scope, $attrs, Notify, Upload
            ) {
                $scope.crop = false;
                $scope.croppedDataUrl = '';
                $scope.required = typeof $attrs.required !== 'undefined';
                $scope.toggleCrop = function() {
                    $scope.crop = !$scope.crop;
                }
                $scope.uploadFile = function (picFile, croppedDataUrl) {
                    if (croppedDataUrl) {
                        picFile = Upload.dataUrltoBlob(croppedDataUrl, picFile.name, picFile.size);
                    }

                    const resizeQuality = 0.7;
                    Upload.resize(picFile, { quality: resizeQuality })
                    .then(function (resizedFile) {
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
                    }).then(function() {
                        if (!validateFile($scope.container.file)) {
                            Notify.error('post.media.error_in_upload');
                        }
                    })
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
