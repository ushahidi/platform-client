module.exports = [ '_', function (_) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '='
        },
        templateUrl: 'templates/posts/post-datetime.html',
        link: function ($scope) {
            // Split date time in time and date fields

            if($scope.value) {
                $scope.date = new Date($scope.value);
                $scope.time = new Date($scope.value);
            }
            $scope.$watch('date', function (){
                console.log($scope.date);
            }, true);
            $scope.$watch('time', function (){
                console.log($scope.time);
            }, true);
        }
    };
}];
