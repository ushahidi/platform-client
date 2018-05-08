module.exports = ModeContext;

ModeContext.$inject = [];

function ModeContext() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: ModeContextController,
        template: require('./mode-context.html')
    };
}

ModeContextController.$inject = [
    '$scope'
];
function ModeContextController(
    $scope
) {
    $scope.test = "I am a test!"
    activate();

    function activate() {

    }
}
