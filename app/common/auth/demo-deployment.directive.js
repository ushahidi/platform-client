module.exports = DemoDeploymentDirective;

DemoDeploymentDirective.$inject = [];
function DemoDeploymentDirective() {
    return {
        restrict: 'E',
        scope: {},
        controller: DemoDeploymentController,
        template: require('./demo-deployment.html')
    };
}

DemoDeploymentController.$inject = [
    '$scope'
];
function DemoDeploymentController(
    $scope
) {

    activate();

    function activate() {

    }
}
