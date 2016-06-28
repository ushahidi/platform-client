module.exports = [
    '$rootScope',
    '$location',
    'PostFilters',
function (
    $rootScope,
    $location,
    PostFilters
) {
    $rootScope.switchRtl = function () {
        $rootScope.rtlEnabled = !$rootScope.rtlEnabled;
    };

    // Setup PL layout and switching function
    $rootScope.globalLayout = 'layout-a';
    $rootScope.setLayout = function (layout) {
        $rootScope.globalLayout = layout;
    };

    // Setup PL modal visible and switching function
    $rootScope.modalVisible = false;
    $rootScope.toggleModalVisible = function (state) {
        $rootScope.modalVisible = (typeof state !== 'undefined') ? state : !$rootScope.modalVisible;
    };

    // Clear filters when navigating to home
    $rootScope.$on('$locationChangeSuccess', function () {
        if ($location.path() === '/') {
            PostFilters.clearFilters();
        }
    });
}];
