// re-route if feature flag is not enabled
module.exports = [
    '$scope',
    'Features',
    '$state',
function (
    $scope,
    Features,
    $state
) {
    Features.loadFeatures()
           .then(() => {
            // WARNING: Add Feature Flag
            $scope.targetedSurveysEnabled = true;
            // $scope.targetedSurveysEnabled = Features.isFeatureEnabled('targeted-surveys');

            // reroute if feature-flag is not turned on
            if (!$scope.targetedSurveysEnabled) {
                $state.go('settings.surveys.create');
            }
        });
}];
