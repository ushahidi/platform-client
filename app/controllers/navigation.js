module.exports = ['$scope', 'Authentication', function( $scope, Authentication ) {
    $scope.mainMenu = false;

    $scope.toggle = function(param) {
        $scope[param] = $scope[param] === false ? true : false;
    };

    $scope.signoutClick = function(){
        event.preventDefault();
        event.stopPropagation();
        Authentication.signout();
    };
}];
