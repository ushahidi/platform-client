module.exports = FilterPostsDirective;

FilterPostsDirective.$inject = [];
function FilterPostsDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            onOpen: '&',
            onClose: '&'
        },
        replace: true,
        controller: FilterPostsController,
        template: require('./filter-posts.html')
    };
}

FilterPostsController.$inject = ['$scope', 'PostFilters', '$state', '$document', '$element'];
function FilterPostsController($scope, PostFilters, $state, $document, $element) {
    $scope.searchSavedToggle = false;
    $scope.status = { isopen: false };
    $scope.hideDropdown = hideDropdown;
    $scope.showDropdown = showDropdown;
    $scope.removeQueryFilter = removeQueryFilter;
    $scope.applyFilters = applyFilters;
    activate();

    function activate() {
        // Watch all click events on the page
        $document.on('click', handleDocumentClick);

        $scope.$on('$destroy', () => {
            $document.off('click', handleDocumentClick);
        });

        $scope.$watch('status.isopen', (value) => {
            if (value) {
                $scope.onOpen();
            } else {
                $scope.onClose();
            }
        });
    }

    function applyFilters() {
        PostFilters.reactiveFilters = true;
        $scope.status.isopen = false;
    }

    function removeQueryFilter() {
        PostFilters.clearFilter('q', '');
    }

    function showDropdown() {
        $scope.status.isopen = true;
    }

    function hideDropdown() {
        $scope.status.isopen = false;
    }

    // Close the dropdown for any clicks outside of the filters
    function handleDocumentClick(evt) {
        // If the click was inside the directive
        if (evt && $element && $element[0].contains(evt.target)) {
            // Ignore it
            return;
        }

        // Otherwise close the dropdown
        $scope.$apply(hideDropdown);
    }
}
