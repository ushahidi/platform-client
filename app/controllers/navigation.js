module.exports = function(app) {
    app.controller('navigation', ['$scope', function($scope) {
        $scope.viewsMenu = false;
        $scope.workspaceMenu = false;
        $scope.toggle = function(param) {
            $scope[param] = $scope[param] === false ? true : false;
        };
    }]);
};