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
        var agreementDate = Date.now();
        var id = Session.getSessionDataEntry('userId');


        TermsOfServiceEndpoint.save({date: agreementDate, id: id, tosDate: CONST.TOS_RELEASE_DATE})
        .$promise.then(function (tosSessionData) {
            Session.setSessionDataEntry('tos', 1499438752092);
            //ModalService.closeModal();//what function goes here
        });

    };

    // function tosSuccess() {
    //     ModalService.closeModal();
    //     //continue authentication
    // }

    // function tosFailure() {

    // }

}
