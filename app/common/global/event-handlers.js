module.exports = [
    '$rootScope',
    '$location',
function (
    $rootScope,
    $location
) {
    $rootScope.goBack = function () {
        var path = $location.path().split('/');
        if (!path.length) {
            return;
        }
        path.pop();
        $location.path(path.join('/'));
    };

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
    $rootScope.toggleModalVisible = function () {
        $rootScope.modalVisible = !$rootScope.modalVisible;
    };
}];
