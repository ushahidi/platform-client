var ROOT_PATH = '../../../../../';

describe('collections mode context directive', function () {

    var $rootScope,
        $scope,
        element,
        Notify;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require('test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('savedSearchModeContext', require('app/main/posts/savedsearches/mode-context.directive'));

        require('test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;

        $scope.savedSearch = {};

        element = '<saved-search-mode-context></saved-search-mode-context>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should save a notification', function () {
        spyOn(Notify, 'notify');
        $scope.saveNotification({id: 'pass'});

        expect(Notify.notify).toHaveBeenCalled();
    });

});
