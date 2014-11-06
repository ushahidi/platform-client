module.exports = [function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        templateUrl: 'templates/partials/post-view-tabs.html'
    };
}];
