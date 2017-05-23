module.exports = PostShareDirective;

PostShareDirective.$inject = [];
function PostShareDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            button: '=?',
            postId: '=?'
        },
        controller: PostShareController,
        template: require('./post-share.html')
    };
}

PostShareController.$inject = [
    '$scope',
    '$window',
    'ModalService'
];
function PostShareController(
    $scope,
    $window,
    ModalService
) {
    $scope.loading = false;
    $scope.openShareMenu = openShareMenu;
    $scope.isButton = isButton;
    $scope.isAdd = isAdd;

    activate();

    function activate() {
    }

    function isButton() {
        return $scope.button;
    }

    function isAdd() {
        if ($window.location.href.indexOf('post') > 0) {
            return true;
        }
        return false;
    }

    function openShareMenu() {
        ModalService.openTemplate('<share-menu></share-menu>', 'app.share', 'share', $scope, true, true);
    }
}
