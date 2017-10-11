module.exports = PostTimelineToolboxDirective;

PostTimelineToolboxDirective.$inject = [
    'moment',
    '$rootScope'
];
function PostTimelineToolboxDirective(
    moment,
    $rootScope
) {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        template: require('./post-timeline-toolbox.html'),
        link: PostTimelineToolboxLink
    };

    function PostTimelineToolboxLink($scope) {
        activate();

        function activate() {

        }
    }
}
