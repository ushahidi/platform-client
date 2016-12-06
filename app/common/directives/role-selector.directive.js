module.exports = RoleSelectorDirective;

RoleSelectorDirective.$inject = [];

function RoleSelectorDirective() {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            title: '='
        },
        controller: RoleSelectorController,
        template: require('./role-selector.html')
    };
}
RoleSelectorController.$inject = ['$scope', 'RoleEndpoint'];

function RoleSelectorController($scope, RoleEndpoint) {
    $scope.setEveryone = setEveryone;


    activate();
    function activate() {
        // getting available roles from api
        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });

        // helper-variable to render yellow checkbox
        $scope.everyone = ($scope.model.role === []) ? true : false;
    }

    // adding all available roles to model if user clicks 'Everyone'
    function setEveryone() {
        $scope.model.role = [];
    }
}
