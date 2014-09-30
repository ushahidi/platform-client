module.exports = ['$scope', function($scope) {

        $scope.selected = 'All';

        $scope.select= function(item) {
            $scope.selected = item;
        };

        $scope.isActive = function(item) {
            return $scope.selected === item;
        };

        $scope.tabs = ['All', 'Admin', 'Member', 'Guest'];

}];
