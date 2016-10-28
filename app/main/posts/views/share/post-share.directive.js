module.exports = PostShareDirective;

PostShareDirective.$inject = [];
function PostShareDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '='
        },
        controller: PostShareController,
        templateUrl: 'templates/main/posts/views/share/post-share.html'
    };
}

PostShareController.$inject = [
    '$scope',
    'ModalService'
];
function PostShareController(
    $scope,
    ModalService
) {
    $scope.loading = false;
    $scope.openShareMenu = openShareMenu;

    activate();

    function activate() {

    }

    function openShareMenu() {
        ModalService.openTemplate('<share-menu></share-menu>', 'app.share', 'share', $scope, true, true);
    }
}
