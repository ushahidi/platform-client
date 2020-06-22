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
        CategoriesSdk.getCategories().then(categories=>{
            _.each($scope.field.value, (value => {
                value.value = _.find(categories, category=>{
                    if (category.id === value.value) {
                        return category.tag;
                        }
                });
                $scope.$apply();
            }));
        });
    }
    activate();
}
