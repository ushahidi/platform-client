module.exports = [
    '$rootScope',
    'UserEndpoint',
    '_',
function (
    $rootScope,
    UserEndpoint,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            endpoint: '@',
            type: '@'
        },
        controller: ['$scope', '$element', '$attrs', '$injector', function ($scope, $element, $attrs, $injector) {
            var endpoint = $injector.get($attrs.endpoint),
                users = [];

            // Load sets + users
            var reloadSets = function () {
                endpoint.query().$promise.then(function (sets) {
                    $scope.sets = sets;

                    angular.forEach($scope.sets, function (set) {
                        // if this set has a user, and its not the currentUser
                        if (_.isObject(set.user) && set.user.id !== _.result($rootScope.currentUser, 'userId')) {
                            // Load the user (if we haven't already)
                            if (!users[set.user.id]) {
                                users[set.user.id] = UserEndpoint.get({id: set.user.id});
                            }
                            // Save user info onto the set itself
                            set.user = users[set.user.id];
                        }
                    });
                });
            };

            // Init map of users to ids
            $scope.type = $attrs.type;

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
