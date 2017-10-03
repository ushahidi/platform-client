module.exports = PostToolbarDirective;

PostToolbarDirective.$inject = [];
function PostToolbarDirective() {
    return {
        restrict: 'E',
        scope: {
            isLoading: '=',
            filters: '=',
            currentView: '=',
            reactiveFilters: '='
        },
        controller: PostToolbarController,
        template: require('./post-toolbar.html')
    };
}

PostToolbarController.$inject = [];
function PostToolbarController() {
}
