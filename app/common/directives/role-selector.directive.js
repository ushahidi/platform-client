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
RoleSelectorController.$inject = ['$scope', 'RoleEndpoint', '$translate', '_'];

function RoleSelectorController($scope, RoleEndpoint, $translate, _) {
    $scope.setEveryone = setEveryone;
    $scope.setAdmin = setAdmin;

    activate();

    function activate() {
        // getting available roles from api
        RoleEndpoint.query().$promise.then(function (roles) {
            $scope.roles = roles;
        });
    }

    function setAdmin() {
        // adding admin to roles_allowed if not already there
        let admin = _.findWhere($scope.roles, {name: 'admin'});
        if (!$scope.model.role) {
            $scope.model.role = [];
        }
        if (_.indexOf($scope.model.role, admin.name) === -1) {
            $scope.model.role.push(admin.name);
        }
        document.getElementById('add_roles').click();
    }

    // adding all available roles to model if user clicks 'Everyone'
    function setEveryone() {
        $scope.model.role = null;
        document.getElementById('add_everyone').click();
    }
}
