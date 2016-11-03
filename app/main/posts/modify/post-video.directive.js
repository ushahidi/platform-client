module.exports = PostVideo;

PostVideo.$inject = [];

function PostVideo() {
    return {
        restrict: 'E',
        scope: {
            videoUrl: '='
        },
        templateUrl: 'templates/main/posts/modify/video.html',
        controller: PostVideoController
    };
}

PostVideoController.$inject = [
    '$scope',
    '$sce',
    'Util'
];

function PostVideoController(
    $scope,
    $sce,
    Util
) {
    $scope.constructIframe = constructIframe;
    // $scope.getVideoThumbnail = getVideoThumbnail;
    activate();

    function activate() {
        // Is this dody? I dunno it seems dodgy
        $scope.videoUrl = $sce.trustAsResourceUrl($scope.videoUrl);
        $scope.previewId = $scope.videoId ? $scope.videoId : Util.simpluUUID();
    }

    function constructIframe(videoUrl) {
        parseVideo(videoUrl);

        var preview = angular.element(document.getElementById($scope.previewId));

        if ($scope.videoUrl === undefined) {
            preview.empty();
        } else {
            preview.empty();
            preview.html(createVideo()).wrap('<div class="video_embed-fluid" />');
        }
    }

    // Originates from PL
    function parseVideo(url) {
        // - Supported YouTube URL formats:
        //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
        //   - http://youtu.be/My2FRPA3Gf8
        //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
        // - Supported Vimeo URL formats:
        //   - http://vimeo.com/25451551
        //   - http://player.vimeo.com/video/25451551
        // - Also supports relative URLs:
        //   - //player.vimeo.com/video/25451551
        if (url) {
            var match = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

            if (match[3].indexOf('youtu') > -1) {
                $scope.videoUrl = 'https://www.youtube.com/embed/' + match[6];
            } else if (match[3].indexOf('vimeo') > -1) {
                $scope.videoUrl = 'https://player.vimeo.com/video/' + match[6];
            } else {
                $scope.videoUrl = undefined;
            }
        }
    }

    // Originates from PL
    function createVideo() {
        return '<iframe src="' + $scope.videoUrl + '" frameborder="0" allowfullscreen>';
    }

    // // Originates from PL
    // function getVideoThumbnail(url, cb) {
    //     // Obtains the video's thumbnail and passed it back to a callback function.
    //     var videoObj = parseVideo(url);
    //     if (videoObj.type === 'youtube') {
    //         cb('//img.youtube.com/vi/' + videoObj.id + '/maxresdefault.jpg');
    //     } else if (videoObj.type === 'vimeo') {
    //         // Requires jQuery
    //         $.get('http://vimeo.com/api/v2/video/' + videoObj.id + '.json', function(data) {
    //             cb(data[0].thumbnail_large);
    //         });
    //     }
    // }
}
