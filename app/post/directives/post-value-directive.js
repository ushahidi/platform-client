module.exports = [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            value: '=',
            attribute: '='
        },
        templateUrl: 'templates/partials/post-detail-value.html',
        link: function (scope /*, element*/) {
            // Ensure value is an array
            if (! angular.isArray(scope.value))
            {
                scope.value = [{
                    value: scope.value
                }];
            }
        }
    };
}];
