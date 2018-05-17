module.exports = HdxDetails;

HdxDetails.$inject = [];
function HdxDetails() {
    return {
        restrict: 'E',
        scope: {
        },
        controller: HdxDetailsController,
        template: require('./hdx-details.html')
    };
}

HdxDetailsController.$inject = [
    '$scope',
    '$rootScope',
    'HxlLicenseEndpoint',
    'HxlOrganisationsEndpoint',
    '$state',
    'HxlMetadataEndpoint'
];
function HdxDetailsController($scope, $rootScope, HxlLicenseEndpoint, HxlOrganisationsEndpoint, $state, HxlMetadataEndpoint) {

    $scope.uploadToHdx = uploadToHdx;
    $scope.error = false;

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    activate();

    function activate() {

        HxlLicenseEndpoint.get().$promise.then((response) => {
            $scope.licenses = response.results;
        });

        HxlOrganisationsEndpoint.get().$promise.then((response) => {
            $scope.organisations = response.results;
        });
    }

    function uploadToHdx() {
        if ($scope.metadata.$valid) {
            $scope.details.export_job_id = parseInt($state.params.jobId);
            $scope.details.user_id = $rootScope.currentUser.userId;
            HxlMetadataEndpoint.save($scope.details).$promise.then((yay) => {
                console.log(yay);
            });
            $scope.error = false;
        } else {
            $scope.error = true;
        }
    }
}
