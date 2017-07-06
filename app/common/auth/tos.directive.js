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
    'ModalService'
];
function TosController(
    $scope,
    Authentication,
    TermsOfService,
    ModalService
) {

    $scope.tosSubmit = function () {
        var agreementDate = Date.now();

        TermsOfService.submitTos(agreementDate)
        .then(tosSuccess, tosFailure);

    };

    function tosSuccess() {
        ModalService.closeModal();
        //continue authentication
    }

    function tosFailure() {

    }

}
