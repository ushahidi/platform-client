module.exports = [
    '$rootScope',
    'SetsEndpoint',
    'UserEndpoint',
    '_',
function (
    $rootScope,
    SetsEndpoint,
    UserEndpoint,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            search:  '='
        },
        controller: ['$scope', function ($scope) {
            // Load sets + users
            var reloadSets = function () {
                $scope.listSets = SetsEndpoint.query({search: $scope.search});
                $scope.listSets.$promise.then(function (sets) {
                    angular.forEach(sets, function (set) {
                        if (_.isObject(set.user) && set.user.id !== _.result($rootScope.currentUser, 'userId')) {
                            $scope.uidMap[set.user.id] = UserEndpoint.get({id: set.user.id});
                        }
                    });
                });
            };

            // Init map of users to ids
            $scope.uidMap = {};

            // Reload sets on login / logout events
            $scope.$on('event:authentication:logout:succeeded', function () {
                reloadSets();
            });
            $scope.$on('event:authentication:login:succeeded', function () {
                reloadSets();
            });

            // Trigger initial load of sets
            reloadSets();
        }],
        templateUrl: 'templates/partials/sets-menu.html'
    };
}];
