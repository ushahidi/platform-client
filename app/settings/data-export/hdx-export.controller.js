module.exports = [
    '$scope',
    '$rootScope',
    'Features',
    '$location',
    'FormEndpoint',
    'FormAttributeEndpoint',
    '_',
function (
    $scope,
    $rootScope,
    Features,
    $location,
    FormEndpoint,
    FormAttributeEndpoint,
    _
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
        if(!$scope.hxlEnabled) {
            return $location.path('/');
        }
    });

    activate();

    function activate () {
        getForms();
    }

    function getForms() {
        FormEndpoint.queryFresh({targeted_survey: false}).$promise.then(function (response) {
            $scope.forms = response;
            attachAttributes();
        });
    }

    function attachAttributes() {
        // requesting attributes and attaches them to the correct form
        _.each($scope.forms, function (form) {
            FormAttributeEndpoint.query({formId: form.id}).$promise.then(function (response) {
                form.attributes = response;
            });
        });
    }
}];
