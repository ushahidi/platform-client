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
    function activate() {}
    activate();
}
