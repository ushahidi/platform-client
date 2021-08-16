module.exports = [
    '$rootScope',
    'ModalService',
    function (
        $rootScope,
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
