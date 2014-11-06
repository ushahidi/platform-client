module.exports = ['$scope', function($scope) {

    // toggle tabs/tab content when clicking show/hide text
    $scope.globalFilterTabs = false;
    $scope.toggle = function(param) {
        $scope[param] = $scope[param] === false ? true : false;
    };

}];
