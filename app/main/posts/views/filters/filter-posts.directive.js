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

FilterPostsController.$inject = ['$rootScope', '$scope', 'PostFilters', '$state', '$document', '$element'];
function FilterPostsController($rootScope, $scope, PostFilters, $state, $document, $element) {
    $scope.searchSavedToggle = false;
    $scope.status = { isopen: false };
    $scope.hideDropdown = hideDropdown;
    $scope.showDropdown = showDropdown;
    $scope.removeQueryFilter = removeQueryFilter;
    $scope.applyFilters = applyFilters;
    PostFilters.reactToFilters = false;
    activate();

    $rootScope.$on('event:filters:modeContext', function () {
        $scope.filters = PostFilters.getFilters();
        activateViewFilters();
    });

    function activate() {
        // Watch all click events on the page
        $document.on('click', handleDocumentClick);
        activateViewFilters();
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

    function activateViewFilters () {
        $scope.filtersInView = angular.copy($scope.filters);
    }

    function applyFilters() {
        PostFilters.reactToFilters = true;
        PostFilters.setFilters($scope.filtersInView);
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
