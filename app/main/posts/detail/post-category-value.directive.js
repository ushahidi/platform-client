module.exports = PostCategoryValue;

PostCategoryValue.$inject = [];

function PostCategoryValue() {
    return {
        restrict: 'E',
        controller: PostCategoryValueController,
        scope: {
            categories: '=',
            activeLanguage:'='
        },
        template: require('./post-category-value.html')
    };
}
PostCategoryValueController.$inject = ['$scope', '_', 'CategoriesSdk'];

function PostCategoryValueController($scope, _, CategoriesSdk) {
    $scope.display = $scope.categories.filter(f => {
        if (_.isUndefined(f._ush_hidden)) {
            return f;
        }
    });
    function activate() {}
    activate();
}
