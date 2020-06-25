module.exports = PostCategoryValue;

PostCategoryValue.$inject = [];

function PostCategoryValue() {
    return {
        restrict: 'E',
        controller: PostCategoryValueController,
        scope: {
            field: '=',
            activeLanguage:'='
        },
        template: require('./post-category-value.html')
    };
}
PostCategoryValueController.$inject = ['$scope', '_', 'CategoriesSdk'];

function PostCategoryValueController($scope, _, CategoriesSdk) {
    function activate() {
    $scope.field.value.value = [];
        _.each($scope.field.value, category => {
                _.each($scope.field.options, option => {
                    if (option.id === category.value) {
                       $scope.field.value.value.push(option);
                    }
                });
        });
    }
    activate();
}
