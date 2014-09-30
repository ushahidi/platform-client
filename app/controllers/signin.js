module.exports = ['$scope', 'Authentication', function($scope, Authentication) {

    var resetSigninForm = function(){
        $scope.username = '';
        $scope.password = '';
    };

    $scope.signinSubmit = function(){
        Authentication.signin($scope.username, $scope.password);
        resetSigninForm();
    };

    resetSigninForm();

}];
