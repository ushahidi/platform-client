module.exports = [function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            value: '=',
            attribute: '='
        },
        templateUrl: 'templates/partials/post-detail-value.html'
    };
}];
