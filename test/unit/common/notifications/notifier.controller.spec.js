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
        .controller('notifierController', require(ROOT_PATH + 'app/common/notifications/notifier.controller.js'))
        .constant('EVENT', {
            ACTIONS : {
                EDIT : 'edit',
                DELETE : 'delete'
            }
        });

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

    it('should hide slider on confirmation result', function () {
        $scope.confirmResult('ok');
        expect($scope.showConfirmationSlider).toEqual(false);
    });

    it('should hide alerts slider on alert result', function () {
        $scope.acknowledgeAlert();
        expect($scope.showAlertSlider).toEqual(false);
    });

    it('should respond to event:show:notification-slider', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('event:show:notification-slider', 'test');
        expect($scope.notificationSliderMessage).toEqual('test');
    });

    it('should respond to event:show:alerts', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('event:show:alerts', 'test');
        expect($scope.alerts).toEqual('test');
    });

    it('should respond to event:show:message-confirm', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('event:show:message-confirm', 'test');
        expect($scope.confirmationMessage).toEqual('test');
    });
});
