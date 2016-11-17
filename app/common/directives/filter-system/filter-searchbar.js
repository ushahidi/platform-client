/**
 * Ushahidi Angular Filter System Master directive
 * Drop in directive master directive responsible for search
 * and selection of appropriate sub directive
 */

module.exports = ['$timeout',
function ($timeout) {
    var link =
        function (
            $scope, $elem, $attrs, formControl
        ) {
            $scope.searchResultsVisible = false;
            $scope.form = formControl;

            $scope.showSearchResults = function () {
                $scope.searchResultsVisible = true;
            };

            $scope.hideSearchResults = function () {
                $timeout(function () {
                    $scope.searchResultsVisible = false;
                }, 100);
            };
        };
    return {
        restrict: 'E',
        replace: true,
        template: require('./filter-searchbar.html'),
        scope: {
            model: '=',
            placeholderEntity: '='
        },
        link: link,
        require: '?^form'
    };
}];
