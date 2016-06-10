var ROOT_PATH = '../../../../../';

describe('collections mode context directive', function () {

    var $rootScope,
        $scope,
        element,
        Notify;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('collectionsModeContext', require(ROOT_PATH + 'app/set/directives/collections/mode-context.directive'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;

        $scope.collection = {};

        element = '<collections-mode-context></collections-mode-context>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should save a notification', function () {
        spyOn(Notify, 'notify');
        $scope.saveNotification({id: 'pass'});

        expect(Notify.notify).toHaveBeenCalled();
    });

});
