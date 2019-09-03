/* eslint-disable */
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
        setVersionId();
    };
    // Setup PL modal visible and switching function
    $rootScope.modalVisible = false;
    $rootScope.toggleModalVisible = function (state) {
        $rootScope.modalVisible = (typeof state !== 'undefined') ? state : !$rootScope.modalVisible;
    };

    function setVersionId() {
        // this function switches the body-id to protect the old PL styles to leak into react
        let id = document.querySelector('#ui-v3');
        if(!id || id.id !== 'ui-v3' && $rootScope.globalLayout !== 'layout-g') {
            let body = document.querySelector('body');
                body.id = 'ui-v3';
        } else if(id.id === 'ui-v3' && $rootScope.globalLayout === 'layout-g') {
            id.id = '';
        }
    }

}];
