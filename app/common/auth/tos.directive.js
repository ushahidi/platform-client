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
    'TermsOfService'
];
function TosController(
    $scope,
    Authentication,
    TermsOfService
) {

    //function submit(){
    //var agreementDate = Date.now();

    //TermsOfService.submitTos(agreementDate);
    ////.then(close modal)
    //}

}
