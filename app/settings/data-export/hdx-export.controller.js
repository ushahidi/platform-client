module.exports = [
    '$scope',
    '$rootScope',
    'Features',
    '$location',
    'HxlExport',
function (
    $scope,
    $rootScope,
    Features,
    $location,
    HxlExport
) {
    $scope.selectedFields = [];
    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    // Check if hxl-feature is enabled
    Features.loadFeatures().then(function () {
        $scope.hxlEnabled = Features.isFeatureEnabled('hxl');
        // Redirect to home if not enabled
        if (!$scope.hxlEnabled) {
            return $location.path('/');
        }
    });

    activate();

    function activate() {
        HxlExport.getFormsWithTags().then((formsWithTags)=> {
            $scope.forms = formsWithTags;
        });
    }
}];
