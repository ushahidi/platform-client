module.exports = PostToolbarDirective;

PostToolbarDirective.$inject = [];
function PostToolbarDirective() {
    return {
        restrict: 'E',
        controller: PostToolbarController,
        templateUrl: 'templates/main/posts/views/post-toolbar.html'
    };
}

PostToolbarController.$inject = [];
function PostToolbarController() {

}
