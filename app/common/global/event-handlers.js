module.exports = [
    '$rootScope',
    '$location',
    '$window',
function (
    $rootScope,
    $location,
    $window
) {
    // Setup PL layout and switching function
    $rootScope.globalLayout = 'layout-a';
    $rootScope.setLayout = function (layout) {
        $rootScope.globalLayout = layout;
    };
    // Set embed mode
    // TODO move this to Util
    var pattern = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/g;
    $rootScope.embedUrl = pattern.exec($window.ushahidi.apiUrl);
    $rootScope.embedUrl = $rootScope.embedUrl[1].replace('api.', '');
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
