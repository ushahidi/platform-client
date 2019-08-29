
module.exports = [
    '$scope',
    'CONST',
    'Verifier',
    function ($scope, CONST, Verifier) {
        $scope.endpointStatuses = [];
        $scope.endpointStructureChecks = [];

        function activate() {
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
            Verifier.verifyStatus(`${CONST.BACKEND_URL}/api/v3/config`, CONST)
            .then(response => {
                $scope.networkCheck = response;
                $scope.$apply();
            });
        }

        function envCheck() {
            $scope.envCheck = Verifier.verifyEnv(CONST);
        }

        function endpointStatusCheck() {
            Verifier.verifyEndpointStatus(CONST).forEach(response => {
                response.then(result=> {
                    $scope.endpointStatuses.push(result);
                    $scope.$apply();
                });
            });
        }

        function endpointStructureCheck() {
            Verifier.verifyEndpointStructure(CONST)
            .then(responses=> {
                    responses.map(response=> {
                            response.then(message=> {
                                $scope.endpointStructureChecks.push(message);
                                $scope.$apply();
                            });
                        });
                });
        }

        function checkTransifex() {
            $scope.transifexCheck = Verifier.verifyTransifex(CONST);
        }

        function verifyOauth() {
            let results = Verifier.verifyOauth(CONST);
            results.status.then(status => {
                $scope.oauthStatus = status;
                $scope.$apply();

            });
            results.structure.then(structure=> {
                $scope.oauthStructure = structure;
                $scope.$apply();

            });
            results.token.then(token=> {
                $scope.oauthToken = token;
                $scope.$apply();
            });
        }

        function verifyDbConnection() {
            Verifier.verifyDbConnection(CONST)
            .then(response => {
                $scope.dbConnection = response;
                $scope.$apply();
            });
        }

        function verifyAPIEnvs() {
            Verifier.verifyAPIEnvs(CONST)
            .then(response => {
                $scope.apiEnvs = response;
                $scope.$apply();
            });
        }
        activate();
    }
];

