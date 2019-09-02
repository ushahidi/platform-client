module.exports = [
    '$scope',
    'CONST',
    'Verifier',
    function ($scope, CONST, Verifier) {
        $scope.networkCheck = true;
        $scope.envCheck = true;
        $scope.endpointStatuses = [];
        $scope.endpointStructureChecks = [];
        $scope.transifexCheck = true;
        $scope.oauthCheck = true;
        $scope.allDisabled = Verifier.isCheckDisabled(CONST, 'ALL');

        function activate() {
            if ($scope.allDisabled) {
                return;
            }
            checkNetwork();
            envCheck();
            endpointStatusCheck();
            endpointStructureCheck();
            checkTransifex();
            verifyOauth();
            verifyDbConnection();
            verifyAPIEnvs();
        }

        function checkNetwork() {
            const verifyNetwork = Verifier.verifyNetwork(CONST);
            if (!verifyNetwork) {
                $scope.networkCheck = false;
            } else {
                verifyNetwork
                .then(response => {
                    $scope.networkCheck = response;
                    $scope.$apply();
                });
            }
        }

        function envCheck() {
            $scope.envCheck = Verifier.verifyEnv(CONST);
        }

        function endpointStatusCheck() {
            const endpointStatusCheck = Verifier.verifyEndpointStatus(CONST);
            if (!endpointStatusCheck) {
                $scope.endpointStatuses = false;
            } else {
                endpointStatusCheck.forEach(response => {
                    response.then(result => {
                        $scope.endpointStatuses.push(result);
                        $scope.$apply();
                    });
                });
            }
        }

        function endpointStructureCheck() {
            const endpointStructureCheck = Verifier.verifyEndpointStructure(CONST);
            if (!endpointStructureCheck) {
                $scope.endpointStructureChecks = false;
            } else {
                endpointStructureCheck.forEach(response => {
                    response.then(result => {
                        $scope.endpointStructureChecks.push(result);
                        $scope.$apply();
                    });
                });
            }
        }

        function checkTransifex() {
            $scope.transifexCheck = Verifier.verifyTransifex(CONST);
        }

        function verifyOauth() {
            const results = Verifier.verifyOauth(CONST);
            if (!results) {
                $scope.oauthCheck = false;
            } else {
                results.status.then(status => {
                    $scope.oauthStatus = status;
                    $scope.$apply();
                });
                results.structure.then(structure => {
                    $scope.oauthStructure = structure;
                    $scope.$apply();
                });
                results.token.then(token => {
                    $scope.oauthToken = token;
                    $scope.$apply();
                });
            }
        }

        function verifyDbConnection() {
            const dbCheck = Verifier.verifyDbConnection(CONST);
            if (!dbCheck) {
                $scope.dbConnection = false;
            } else {
                dbCheck
                .then(response => {
                    $scope.dbConnection = response;
                    $scope.$apply();
                });
            }
        }

        function verifyAPIEnvs() {
            const apiEnvCheck = Verifier.verifyAPIEnvs(CONST);
            if (!apiEnvCheck) {
                $scope.apiEnvs = false;
            } else {
                apiEnvCheck.then(response => {
                    $scope.apiEnvs = response;
                    $scope.$apply();
                });
            }
        }
        activate();
    }
];
