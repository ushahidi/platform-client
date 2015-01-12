module.exports = [function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            active: '@'
        },
        templateUrl: 'templates/partials/tool-menu.html',
    };
}];
