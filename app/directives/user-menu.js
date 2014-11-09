module.exports = [function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            signoutClick: '&'
        },
        templateUrl: 'templates/partials/user-menu.html',

    };
}];
