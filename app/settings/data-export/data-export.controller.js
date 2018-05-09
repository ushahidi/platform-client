module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    'DataExport',
    'Notify',
    'FormEndpoint',
    'FormAttributeEndpoint',
    '_',
    'LoadingProgress',
function (
    $scope,
    $rootScope,
    $location,
    DataExport,
    Notify,
    FormEndpoint,
    FormAttributeEndpoint,
    _,
    LoadingProgress
) {
    $scope.exportAll = exportAll;
    $scope.showFields = false;
    $scope.showProgress = false;
    $scope.selectFields = selectFields;
    $scope.selectedFields = [];
    $scope.exportSelected = exportSelected;
    $scope.selectAll = selectAll;
    $scope.displayedForms = [];
    $scope.getForms = getForms;
    $scope.isLoading = LoadingProgress.getLoadingState;
    $scope.attachAttributes = attachAttributes;
    $scope.loadExportJobs = loadExportJobs;
    $scope.switchTab = switchTab;
    $scope.exportJobs = [];

    $rootScope.$on('event:export_job:stopped', function () {
        $scope.showProgress = false;
    });

    // Redirect to home if not authorized
    if ($rootScope.hasPermission('Bulk Data Import') === false) {
        return $location.path('/');
    }
    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    activate();

    function activate() {
        $scope.loadExportJobs();
        $scope.tab_history = {};

        // Set initial menu tab
        $scope.switchTab('export', 'main');
    }

    function getForms() {
        FormEndpoint.queryFresh().$promise.then(function (response) {
            $scope.forms = response;
            $scope.attachAttributes();
        });
    }

    function switchTab(section, tab) {

        // First unset last active tab
        var old_tab = $scope.tab_history[section];
        if (old_tab) {
            var old_tab_li = old_tab + '-li';
            angular.element(document.getElementById(old_tab)).removeClass('active');
            angular.element(document.getElementById(old_tab_li)).removeClass('active');
        }
        // Set new active tab
        tab = tab + '-' + section;
        $scope.tab_history[section] = tab;
        var tab_li = tab + '-li';
        angular.element(document.getElementById(tab)).addClass('active');
        angular.element(document.getElementById(tab_li)).addClass('active');
    }


    function attachAttributes() {
        // requesting attributes and attaches them to the correct form
        _.each($scope.forms, function (form) {
            FormAttributeEndpoint.query({formId: form.id}).$promise.then(function (response) {
                form.attributes = response;
            });
        });
    }

    function selectFields() {
        $scope.showFields = !$scope.showFields;
    }

    function selectAll(form) {
        $scope.selectedFields[form.id] = !$scope.selectedFields[form.id] ? [] : $scope.selectedFields[form.id];
        if ($scope.selectedFields[form.id].length === form.attributes.length) {
            $scope.selectedFields[form.id] = [];
        } else {
            _.each(form.attributes, function (attribute) {
                if (!_.contains($scope.selectedFields[form.id], attribute.key)) {
                    $scope.selectedFields[form.id].push(attribute.key);
                }
            });
        }
    }

    function exportAll() {
        DataExport.startExport({});
        $scope.showProgress = true;
    }

    function exportSelected() {
        var fields = _.chain($scope.selectedFields)
            .flatten() // concatinating attributes into one array
            .compact() // removing nulls
            .value(); // output
        if (fields.length === 0) {
            // displaying notification if no fields are selected
            var message =  '<p translate="data_export.no_fields"></p>';
            Notify.notifyAction(message, null, false, 'warning', 'error');
        } else {
            DataExport.startExport({fields});
            $scope.showFields = false;
            $scope.showProgress = true;
        }
    }

    function loadExportJobs() {
        DataExport.loadExportJobs().then(function (response) {
            DataExport.setExportJobs(DataExport.processExportJobs(response));
            $scope.exportJobs = DataExport.getExportJobs();
        });
    }

    $scope.$on('exportJobs:updated', (event, data, newData) => {
        $scope.exportJobs = DataExport.getExportJobs();
    });


    // start fetching forms to display
    getForms();
}];
