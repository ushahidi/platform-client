module.exports = ['$scope', 'Authentication', function($scope, Authentication) {

    var resetSigninForm = function(){
        $scope.username = '';
        $scope.password = '';
    };

    var setSigningInToFalse = function(){
        $scope.signing_in = false;
        resetSigninForm();
    };

    $scope.signinSubmit = function(){
        $scope.signing_in = true;
        var promise = Authentication.signin($scope.username, $scope.password);

        promise.then(setSigningInToFalse, setSigningInToFalse);
    };

    setSigningInToFalse();

}];
