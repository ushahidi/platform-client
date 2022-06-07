module.exports = [
    '$rootScope',
function (
    $rootScope
) {
    // Setup PL layout and switching function
    $rootScope.globalLayout = 'layout-a';
    $rootScope.setLayout = function (layout) {
        $rootScope.globalLayout = layout;
        $rootScope.$emit('layoutChange', layout);
    };
    // Setup PL modal visible and switching function
    $rootScope.modalVisible = false;

    $rootScope.toggleModalVisible = function (state) {
            $rootScope.modalVisible = (typeof state !== 'undefined') ? state : !$rootScope.modalVisible;
    };
}];
