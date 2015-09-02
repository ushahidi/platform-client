module.exports = [
    '$location',
    'ConfigEndpoint',
function (
    $location,
    ConfigEndpoint
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            active: '=',
            baseUrl: '@'
        },
        templateUrl: 'templates/posts/post-view-tabs.html',
        link: function ($scope, $element, $attrs) {

            $scope.views = [];

            // Get available views from backend
            ConfigEndpoint.get({ id: 'features' }).$promise.then(function (response) {

                if (response.post_view_map)
                    $scope.views.push('map');
                if (response.post_view_list)
                    $scope.views.push('list');
                if (response.post_view_chart)
                    $scope.views.push('chart');
                if (response.post_view_timeline)
                    $scope.views.push('timeline');

            });

        }
    };
}];
