module.exports = HdxDetails;

HdxDetails.$inject = [];
function HdxDetails() {
    return {
        restrict: 'E',
        controller: HdxDetailsController,
        template: require('./hdx-details.html')
    };
}

HdxDetailsController.$inject = [
    '$scope',
    '$rootScope',
    '$stateParams',
    'LoadingProgress',
    'Features',
    'ConfigEndpoint',
    'HxlLicenseEndpoint',
    'HxlOrganisationsEndpoint',
    '$state',
    'HxlMetadataEndpoint',
    'DataExport',
    'Notify'
];
function HdxDetailsController($scope, $rootScope, $stateParams, LoadingProgress, Features, ConfigEndpoint, HxlLicenseEndpoint, HxlOrganisationsEndpoint, $state, HxlMetadataEndpoint, DataExport, Notify) {
    $scope.exportJob = $stateParams.exportJob;
    $scope.uploadToHdx = uploadToHdx;
    $scope.error = false;
    $scope.isLoading = LoadingProgress.getLoadingState;
    $scope.showProgress = false;
    $scope.title = 'data_export.add_details';
    $scope.description = 'data_export.details_desc';
    $scope.details = {
        private: true
    };
    // Checking feature-flag for user-settings and hxl
    Features.loadFeatures().then(function () {
        if (!Features.isFeatureEnabled('hxl')) {
            $state.go('posts.map');
        }
    });
    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    activate();

    function activate() {
        // todo: once we get metadata, check if there is an ongoing export-job with metadata already
        // HxlMetadataEndpoint.get({export_job_id: $state.params.jobId}).$promise.then((response) => {
        //     if(response.id) {
        //         $scope.showProgress = true;
        //         $scope.title = 'data_export.uploading_data';
        //         $scope.description = 'data_export.uploading_data_desc';
        //     }
        // });

        // Pre-populating source with deployment-name
        ConfigEndpoint.get({id: 'site'}, function (site) {
            $scope.details.source = site.name;
        });

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
            HxlMetadataEndpoint.save($scope.details).$promise.then((response) => {
                if (response.id) {
                    $scope.exportJob.hxl_meta_data_id = response.id;
                    DataExport.startExport($scope.exportJob).then((response)=> {
                        $scope.showProgress = true;
                        $scope.title = 'data_export.uploading_data';
                        $scope.description = 'data_export.uploading_data_desc';
                    });
                }
            }, (err) => {
                Notify.error('data_export.uploading_data_err');
            });
            $scope.error = false;
        } else {
            $scope.error = true;
        }
    }
}
