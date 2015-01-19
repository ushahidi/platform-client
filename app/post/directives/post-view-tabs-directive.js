module.exports = [function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '=',
            active: '@',
            translate: '@'
        },
        templateUrl: 'templates/partials/post-view-tabs.html'
    };
}];
