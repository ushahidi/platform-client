var rootPath = '../../../../';

describe('Notify', function () {

    var Notify, $rootScope;

    beforeEach(function () {
        var testApp = angular.module('testApp');
        testApp.service('Notify', require(rootPath + 'app/common/services/notify.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);
    });

    beforeEach(angular.mock.module('testApp'));

    beforeEach(inject(function (_$rootScope_, _Notify_, _$window_) {
        $rootScope = _$rootScope_;
        Notify = _Notify_;
    }));

    describe('showSingleAlert', function () {
        beforeEach(function () {
            spyOn($rootScope, '$emit').and.callThrough();
            Notify.showSingleAlert('Test message');
        });

        it('calls $rootScope.$on with the passed in alertMessage', function () {
            expect($rootScope.$emit).toHaveBeenCalled();
            var alertMessage = $rootScope.$emit.calls.mostRecent().args;
            expect(alertMessage[1]).toEqual(['Test message']);
        });
    });

    describe('showAlerts', function () {
        beforeEach(function () {
            spyOn($rootScope, '$emit').and.callThrough();
            Notify.showAlerts(['Test message 1', 'Test message 2']);
        });

        it('calls $rootScope.$on with the combined alert messages', function () {
            expect($rootScope.$emit).toHaveBeenCalled();
            var alertMessage = $rootScope.$emit.calls.mostRecent().args;
            expect(alertMessage[1]).toEqual(['Test message 1', 'Test message 2']);
        });
    });
});
