module.exports = PostVideo;

PostVideo.$inject = [];

function PostVideo() {
    return {
        restrict: 'E',
        scope: {
            videoUrl: '='
        },
        template: require('./video.html'),
        controller: PostVideoController
    };
}

PostVideoController.$inject = [
    '$scope',
    '$sce',
    'Util',
    'PostEditService',
    'Notify'
];

function PostVideoController(
    $scope,
    $sce,
    Util,
    PostEditService,
    Notify
) {
    $scope.constructIframe = constructIframe;
    activate();
    function activate() {
        // Here we make a statement of trust of the URL based on having previously constructed it
        if (!$scope.$parent.form.$error.videoUrlValidation) {
            $scope.video = $sce.trustAsResourceUrl($scope.videoUrl);
            $scope.previewId = $scope.videoId ? $scope.videoId : Util.simpluUUID();
        }
    }

    function constructIframe(videoUrl) {
        parseVideo(videoUrl);

        var preview = angular.element(document.getElementById($scope.previewId));

        if ($scope.$parent.form.$error.videoUrlValidation) {
            preview.empty();
            if ($scope.videoUrl === undefined) {
                $scope.$parent.form.$setValidity('videoUrlValidation', true, PostVideoController);
            }
        } else {
            preview.empty();
            if ($scope.videoUrl !== undefined) {
                preview.html(createVideo()).wrap('<div class="video_embed-fluid" />');
            }
        }
    }

    // Originates from PL
    function parseVideo(url) {
        if (url) {
            // NOTE: It is very important to pay special attention to the santization needs of this regex if it is changed.
            // It is important that it does not allow subdomains other than player or www in order to ensure that a malicious user
            // can not exploit this field to insert malicious content in an iframe
            var match = PostEditService.validateVideoUrl(url);
            if (match) {
                if (match[3].indexOf('youtu') > -1) {
                    $scope.$parent.form.$setValidity('videoUrlValidation', true, PostVideoController)
                    // Here we make a statement of trust of the URL based on having pulled out just the id
                    $scope.videoUrl = 'https://www.youtube.com/embed/' + match[6];
                    $scope.video = $sce.trustAsResourceUrl($scope.videoUrl);
                } else if (match[3].indexOf('vimeo') > -1) {
                    $scope.$parent.form.$setValidity('videoUrlValidation', true, PostVideoController)
                    // Here we make a statement of trust of the URL based on having pulled out just the id
                    $scope.videoUrl = 'https://player.vimeo.com/video/' + match[6];
                    $scope.video = $sce.trustAsResourceUrl($scope.videoUrl);
                }
            } else {
                $scope.$parent.form.$setValidity('videoUrlValidation', false, PostVideoController)
                Notify.error('notify.video.incorrect_url', { url: url });
            }
        } else {
            $scope.videoUrl = undefined;
        }
    }

    // Originates from PL
    function createVideo() {
        return '<iframe src="' + $scope.video + '" frameborder="0" allowfullscreen>';
    }

}
