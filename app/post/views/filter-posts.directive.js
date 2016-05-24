module.exports = FilterPostsDirective;

FilterPostsDirective.$inject = [];
function FilterPostsDirective() {
    return {
        restrict: 'E',
        scope: {},
        replace: true,
        controller: FilterPostsController,
        templateUrl: 'templates/posts/views/filter-posts.html'
    };
}

FilterPostsController.$inject = [];
function FilterPostsController() {

}
