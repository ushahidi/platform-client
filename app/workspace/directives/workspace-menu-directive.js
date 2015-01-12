module.exports = [function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            activePage: '='
        },
        templateUrl: 'templates/partials/workspace-menu.html',
    };
}];
