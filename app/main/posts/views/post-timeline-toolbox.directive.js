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
            orderBy: '<',
            order: '<',
            onChange: '&'
        },
        template: require('./post-timeline-toolbox.html'),
        link: PostTimelineToolboxLink
    };

    function PostTimelineToolboxLink($scope) {
        $scope.change = change;

        activate();

        function activate() {

        }

        function change() {
            $scope.onChange({order: $scope.order, orderBy: $scope.orderBy});
        }
    }
}
