module.exports = ShareMenuDirective;

ShareMenuDirective.$inject = [];
function ShareMenuDirective() {
    return {
        restrict: 'E',
        scope: {
            surveyId: '=',
            postId: '='
        },
        replace: true,
        controller: ShareMenuController,
        template: require('./share-menu-modal.html')
    };
}

ShareMenuController.$inject = [
    '$scope',
    '$routeParams',
    'Util',
    '$window'
];
function ShareMenuController(
    $scope,
    $routeParams,
    Util,
    $window
) {

}
