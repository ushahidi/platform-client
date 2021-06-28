module.exports = [
    '$rootScope',
    'UserEndpoint',
    'ModalService',
    function (
        $rootScope,
        UserEndpoint,
        ModalService
    ) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            template: require('./admin-user-setup.html'),
            link: function (scope) {
                scope.$on('event:close', function () {
                    ModalService.close();
                });
            }
        };
    }];
