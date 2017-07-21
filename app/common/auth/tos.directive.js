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
    'ModalService',
    'TermsOfServiceEndpoint',
    'Session',
    'CONST'
];
function TosController(
    $scope,
    Authentication,
    TermsOfService,
    ModalService,
    TermsOfServiceEndpoint,
    Session,
    CONST
) {

    $scope.tosSubmit = function () {

        TermsOfServiceEndpoint.save({tos_version_date: CONST.TOS_RELEASE_DATE})
        .$promise.then(function (tosSessionData) {
            Session.setSessionDataEntry('tos', tosSessionData.agreement_date);
            //don't really need this if, but it's just a backup so that you can't access the site if tos is not set properly
            if (Session.getSessionDataEntry('tos')) {
                $scope.$parent.closeModal();
            }
        });
    };
}
