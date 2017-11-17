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

    activate();

    function activate() {
        console.log($scope);
    }
}
