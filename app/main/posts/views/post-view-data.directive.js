module.exports = PostViewData;

PostViewData.$inject = [];
function PostViewData() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '=',
            currentView: '=',
            post: '='
        },
        controller: require('./post-view-data.controller.js'),
        template: require('./post-view-data.html')
    };
}
