module.exports = [function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            signedin: '=',
            signoutClick: '&'
        },
        templateUrl: 'templates/partials/signin-signout-button.html',

    };
}];
