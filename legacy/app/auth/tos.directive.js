module.exports = TermsOfServiceDirective;

TermsOfServiceDirective.$inject = [];
function TermsOfServiceDirective() {
    return {
        restrict: 'E',
        scope: {},
        controller: TosController,
        template: require('./tos.html')
    };
}

TosController.$inject = [
    '$scope',
    'Authentication',
    'TermsOfService',
    'TermsOfServiceEndpoint',
    'Session',
    'CONST'
];
function TosController(
    $scope,
    Authentication,
    TermsOfService,
    TermsOfServiceEndpoint,
    Session,
    CONST
) {
    $scope.terms = {
        accept: false
    };

    $scope.tosSubmit = function () {
        if (!$scope.terms.accept) {
            return;
        }

        TermsOfServiceEndpoint.save({tos_version_date: CONST.TOS_RELEASE_DATE})
        .$promise.then(function (tosSessionData) {
            // Don't really need this if, but it's just a backup so that you can't access the site if tos is not set properly
            if (tosSessionData.agreement_date) {
                $scope.$parent.confirm();
            }
        });
    };
}
