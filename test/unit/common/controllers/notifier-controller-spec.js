var ROOT_PATH = '../../../../';

describe('notifier controller', function () {

    var $rootScope,
        $controller,
        $scope;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        // .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'))
        .controller('notifierController', require(ROOT_PATH + 'app/common/controllers/notifier.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(function () {
        $controller('notifierController', {
            $rootScope: $rootScope,
            $scope: $scope
        });
    });

    it('should hide modal on confirmation result', function () {
        $scope.confirmResult('ok');
        expect($scope.showModalConfirm).toEqual(false);
    });

    it('should hide alerts modal on alert result', function () {
        $scope.acknowledgeAlert();
        expect($scope.showModalAlerts).toEqual(false);
    });

    it('should respond to event:show:notification-slider', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('event:show:notification-slider', 'test');
        expect($scope.notificationSliderMessage).toEqual('test');
    });

    it('should respond to event:show:modal-alerts', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('event:show:modal-alerts', 'test');
        expect($scope.modalAlertMessages).toEqual('test');
    });

    it('should respond to event:show:modal-confirm', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('event:show:modal-confirm', 'test');
        expect($scope.modalConfirmMessage).toEqual('test');
    });
});
