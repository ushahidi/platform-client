
module.exports = [
    '$rootScope',
    '$scope',
    'Verifier',
    function ($rootScope, $scope, Verifier) {
        $rootScope.setLayout('layout-c');
        $scope.networkCheck;
        $scope.envCheck;
        $scope.endpointChecks = [];
        function activate() {
            checkNetwork();
            envCheck();
            endpointChecks();
            checkTransifex();
        }

        function checkNetwork() {
            let checkDisabled = Verifier.isCheckDisabled('NETWORK');
            if (checkDisabled) {
                $scope.networkCheck = checkDisabled;
                return;
            }

            Verifier.verifyStatus(`${BACKEND_URL}/api/v3/config`)
            .then(response => {
                $scope.networkCheck = response;
                $scope.$apply();
            });
        }

        function envCheck() {
            let checkDisabled = Verifier.isCheckDisabled('ENV');
            if (checkDisabled) {
                $scope.envCheck = checkDisabled;
                return;
            }
            $scope.envCheck = Verifier.verifyEnv();
        }

        function endpointChecks() {
            const endpoints = ['tags', 'forms', 'config/feature', 'config/map'];
            endpoints.forEach(function (endpoint) {
                Verifier.verifyStatus(`${BACKEND_URL}/api/v3/${endpoint}`)
                .then(response => {
                    $scope.endpointChecks.push(response);
                    $scope.$apply();
                });
            });
        }
        function checkTransifex() {
            let checkDisabled = Verifier.isCheckDisabled('TRANSIFEX');
            if (checkDisabled) {
                $scope.transifexCheck = checkDisabled;
                return;
            }
            $scope.transifexCheck = Verifier.verifyTransifex();
        }
        activate();
    }
];

