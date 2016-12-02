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
    RoleEndpoint.query().$promise.then(function (roles) {
        $scope.roles = roles;
    });
}
