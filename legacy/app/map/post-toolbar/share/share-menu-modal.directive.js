module.exports = ShareMenuDirective;

ShareMenuDirective.$inject = [];
function ShareMenuDirective() {
    return {
        restrict: 'E',
        scope: {
            surveyId: '=',
            postId: '=',
            filters: '='
        },
        replace: true,
        controller: ShareMenuController,
        template: require('./share-menu-modal.html')
    };
}

ShareMenuController.$inject = [
    '$scope',
    '$window'
];
function ShareMenuController(
    $scope,
    $window
) {
}
