module.exports = FilterPostsDirective;

FilterPostsDirective.$inject = [];
function FilterPostsDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '=',
            onOpen: '&',
            onClose: '&',
            stats: '='
        },
        replace: true,
        controller: FilterPostsController,
        template: require('./filter-posts.html')
    };
}

FilterPostsController.$inject = ['$rootScope', '$scope', 'PostFilters', '$state', '$document', '$element', 'FocusTrap'];
function FilterPostsController($rootScope, $scope, PostFilters, $state, $document, $element, FocusTrap) {
    function dropdownContainerLink() {
        let container = document.querySelector('#dropdown-window');
        let trap = FocusTrap.createFocusTrap('#dropdown-window');

        $rootScope.$on('event:pauseTrap', function(event, value) {
            value ? trap.pause() : trap.unpause();
        });

        function watchClassAttribute(mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes') {
                    let attrName = mutation.attributeName;
                    let getAttr = mutation.target.getAttribute(attrName);
                    if (getAttr.match('active')) {
                        trap.activate();
                    } else {
                        trap.deactivate();
                    }
                }
            });
        }

        const observer = new MutationObserver(watchClassAttribute);
        observer.observe(container, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    dropdownContainerLink();

    $scope.searchSavedToggle = false;
    $scope.status = { isopen: false };
    $scope.hideDropdown = hideDropdown;
    $scope.showDropdown = showDropdown;
    $scope.toggleDropdown = toggleDropdown;
    $scope.removeQueryFilter = removeQueryFilter;
    $scope.applyFilters = applyFilters;
    PostFilters.reactiveFilters = false;
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
        if ($state.$current.includes['posts.data']) {
            PostFilters.reactiveFilters = true;
        }
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
    function toggleDropdown(event) {
        switch (event.keyCode) {
            case 27: $scope.hideDropdown();
                break;
            case 13: $scope.hideDropdown();
                break;
            default:
                $scope.showDropdown();
        }
    }
}
