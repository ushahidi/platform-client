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

            $scope.applyFilters = function () {
                $scope.searchResultsVisible = false;
            };

            $scope.showSearchResults = function () {
                $scope.searchResultsVisible = true;
            };

            $scope.detectSubmit = function (event) {
                event.stopPropagation();
                if (event && event.keyCode === 13) {
                    $scope.hideSearchResults();
                } else {
                    $scope.showSearchResults();
                }
            };

            $scope.hideSearchResults = function () {
                $scope.searchResultsVisible = false;
            };
        };

    return {
        restrict: 'E',
        replace: true,
        template: require('./filter-searchbar.html'),
        scope: {
            model: '=',
            placeholderEntity: '=',
            onClear: '&'
        },
        link: link,
        require: '?^form'
    };
}];
