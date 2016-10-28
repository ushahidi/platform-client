module.exports = UshLogoDirective;

UshLogoDirective.$inject = [];
function UshLogoDirective() {
    return {
        restrict: 'E',
        controller: UshLogoController,
        replace: true,
        templateUrl: 'templates/common/directives/ush-logo.html'
    };
}

UshLogoController.$inject = [];
function UshLogoController() {
}
