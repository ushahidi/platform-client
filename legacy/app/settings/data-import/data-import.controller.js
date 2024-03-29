module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    'FormEndpoint',
    '_',
    function (
        $scope,
        $rootScope,
        $location,
        $translate,
        FormEndpoint,
        _
    ) {
        // Redirect to home if not authorized
        if ($rootScope.hasManageSettingsPermission() === false) {
            return $location.path('/');
        }

        // Change layout class
        $rootScope.setLayout('layout-c');
        // Change mode
        $scope.$emit('event:mode:change', 'settings');

        $scope.fileContainer = {
            file: null
        };

        FormEndpoint.queryFresh().$promise.then(function (response) {
            $scope.forms = response;
        });
    }
];
