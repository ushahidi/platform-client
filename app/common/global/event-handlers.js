module.exports = [
    '$rootScope',
    '$location',
function (
    $rootScope,
    $location
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
}];
