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
PostCategoryValueController.$inject = ['$scope', '_'];

function PostCategoryValueController($scope, _) {
    // Make a list of parent category ids referenced by categories in the list
    let parent_ids = _.uniq(_.without(_.pluck($scope.categories, 'parent_id'), null));
    $scope.display = $scope.categories.filter(f => {
        // Hide categories that have been marked as inaccessible by the API
        if (_.isUndefined(f._ush_hidden)) {
            // Hide categories that have been referenced as their parent categories by some
            // other category in the list
            if (!parent_ids.includes(f.id)) {
                return f;
            }
        }
    });
    function activate() {}
    activate();
}
