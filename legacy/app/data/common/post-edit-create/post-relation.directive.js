module.exports = [
    'PostEndpoint',
    '_',
function (
    PostEndpoint,
    _
) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            id: '@',
            name: '@',
            model: '=',
            required: '=',
            attribute: '='
        },
        template: require('./relation.html'),
        link: function ($scope) {

            $scope.noResults = false;
            $scope.searching = false;

            $scope.$watch(function () {
                return $scope.model;
            }, function (newValue, oldValue) {
                if (!$scope.selectedPost || $scope.selectedPost.id !== newValue) {
                    $scope.selectedPost = PostEndpoint.get({ id: $scope.model });
                }
            });

            $scope.search = function (event) {
                event.preventDefault();
                var query = { q : $scope.searchTerm };

                if ($scope.attribute.config.input && $scope.attribute.config.input.form) {
                    query.form = $scope.attribute.config.input.form.join(',');
                }

                $scope.noResults = false;
                $scope.searching = true;

                PostEndpoint.query(query).$promise.then(function (response) {
                    $scope.searching = false;
                    $scope.results = response.results;
                    if (!response.results.length) {
                        $scope.noResults = true;
                    }
                });
            };

            $scope.selectPost = function (post) {
                $scope.model = post.id;
                $scope.selectedPost = post;
                $scope.results = null;
            };

            $scope.clearPost = function () {
                $scope.model = null;
                $scope.selectedPost = null;
            };
        }
    };

}];
