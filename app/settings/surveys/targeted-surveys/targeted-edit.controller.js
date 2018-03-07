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
    $scope.isActiveStep = isActiveStep;
    $scope.isStepComplete = isStepComplete;
    $scope.completeStepOne = completeStepOne;
    $scope.completeStepTwo = completeStepTwo;
    $scope.completeStepThree = completeStepThree;
    $scope.publish = publish;
    $scope.previousStep = previousStep;
    $scope.activeStep = 1;
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

    function isActiveStep(step) {
        return $scope.activeStep === step;
    }

    function isStepComplete(step) {
        // todo: check if form-parts of this step is dirty, then return false, else return true.
        return true;
    }

    function completeStepOne() {
        // Insert validation for step 1 here
        $scope.activeStep = 2;
    }

    function completeStepTwo() {
        // Insert validation for step 2 here
        $scope.activeStep = 3;
    }

    function completeStepThree() {
        // Insert validation for step 3 here
        $scope.activeStep = 4;
    }

    function publish() {
        // Insert validation/safety-modal-check + publishing survey here
    }

    function previousStep() {
        $scope.activeStep = $scope.activeStep - 1;
    }
}];
