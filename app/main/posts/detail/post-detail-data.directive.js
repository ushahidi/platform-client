module.exports = PostDetailData;

PostDetailData.$inject = [];
function PostDetailData() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '=',
            editMode: '=',
            postContainer: '='
        },
        controller: require('./post-detail-data.controller.js'),
        template: require('./post-detail-data.html')
    };
}
