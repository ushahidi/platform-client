module.exports = [
    '$rootScope',
    '$location',
    '$window',
    'Util',
function (
    $rootScope,
    $location,
    $window,
    Util
) {
    // Setup PL layout and switching function
    $rootScope.globalLayout = 'layout-a';
    $rootScope.setLayout = function (layout) {
        $rootScope.globalLayout = layout;
    };
    // Set embed mode
    $rootScope.embedUrl = Util.deploymentUrl();
    $rootScope.globalEmbed = ($window.self !== $window.top) ? true : false;
    if ($rootScope.globalEmbed) {
        $rootScope.setLayout('layout-embed');
    }
    // Setup PL modal visible and switching function
    $rootScope.modalVisible = false;
    $rootScope.toggleModalVisible = function (state) {
        $rootScope.modalVisible = (typeof state !== 'undefined') ? state : !$rootScope.modalVisible;
    };
}];
