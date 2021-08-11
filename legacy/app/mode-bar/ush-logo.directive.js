module.exports = UshLogoDirective;

UshLogoDirective.$inject = [];
function UshLogoDirective() {
    return {
        restrict: 'E',
        controller: UshLogoController,
        replace: true,
        template: require('./ush-logo.html')
    };
}

UshLogoController.$inject = [];
function UshLogoController() {
}
