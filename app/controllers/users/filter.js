module.exports = ['$scope', function($scope) {

        $scope.selected = 'all';

        $scope.select= function(item) {
            $scope.selected = item;
        };

        $scope.isActive = function(item) {
            return $scope.selected === item;
        };

        $scope.tabs = ['all', 'admin', 'member', 'guest'];

}];
