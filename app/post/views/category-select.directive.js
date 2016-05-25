module.exports = CategorySelectDirective;

CategorySelectDirective.$inject = [];
function CategorySelectDirective() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        controller: CategorySelectController,
        templateUrl: 'templates/posts/views/category-select.html'
    };
}

CategorySelectController.$inject = ['$scope', 'TagEndpoint'];
function CategorySelectController($scope, TagEndpoint) {
    $scope.categories = [];

    activate();

    function activate() {
        // Load forms
        $scope.categories = TagEndpoint.query();
    }
}
