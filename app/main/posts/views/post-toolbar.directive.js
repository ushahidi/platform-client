module.exports = PostToolbarDirective;

PostToolbarDirective.$inject = [];
function PostToolbarDirective() {
    return {
        restrict: 'E',
        scope: {
            isLoading: '='
        },
        controller: PostToolbarController,
        template: require('./post-toolbar.html')
    };
}

PostToolbarController.$inject = ['$scope'];
function PostToolbarController($scope) {
}
