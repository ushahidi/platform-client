module.exports = [
    '$rootScope',
    '$location',
function (
    $rootScope,
    $location
) {
    // Setup PL layout and switching function
    $rootScope.globalLayout = 'layout-a';
    $rootScope.setLayout = function (layout) {
        $rootScope.globalLayout = layout;
    };
    // Setup PL modal and demo-bar visible and switching function
    $rootScope.modalVisible = false;
    $rootScope.demoBarVisible = false;

    $rootScope.toggleModalVisible = function (state, demo) {
        if (!demo) {
            $rootScope.modalVisible = (typeof state !== 'undefined') ? state : !$rootScope.modalVisible;
        } else {
            $rootScope.demoBarVisible = (typeof state !== 'undefined') ? state : !$rootScope.demoBarVisible;
        }
    };
}];
