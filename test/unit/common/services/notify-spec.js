var rootPath = '../../../../';

describe('Notify', function () {

    var Notify, $window;

    beforeEach(function () {
        var testApp = angular.module('testApp');
        testApp.service('Notify', require(rootPath + 'app/common/services/notify.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);
    });

    beforeEach(angular.mock.module('testApp'));

    beforeEach(inject(function (_Notify_, _$window_) {
        Notify = _Notify_;
        $window = _$window_;
    }));

    describe('showSingleAlert', function () {
        beforeEach(function () {
            spyOn($window, 'alert');
            Notify.showSingleAlert('Test message');
        });

        it('calls $window.alert with the passed in alertMessage', function () {
            expect($window.alert).toHaveBeenCalled();
            var alertMessage = $window.alert.calls.mostRecent().args[0];
            expect(alertMessage).toEqual('Test message');
        });
    });

    describe('showAlerts', function () {
        beforeEach(function () {
            spyOn($window, 'alert');
            Notify.showAlerts(['Test message 1', 'Test message 2']);
        });

        it('calls $window.alert multiple times with the passed in alert messages', function () {
            expect($window.alert.calls.count()).toEqual(2);
            expect($window.alert.calls.argsFor(0)[0]).toEqual('Test message 1');
            expect($window.alert.calls.argsFor(1)[0]).toEqual('Test message 2');
        });
    });
});
