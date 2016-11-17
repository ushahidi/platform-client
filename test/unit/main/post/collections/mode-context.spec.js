describe('collections mode context directive', function () {

    var $rootScope,
        $scope,
        element,
        Notify;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp
        .directive('collectionsModeContext', require('app/main/posts/collections/mode-context.directive'))
        .service('CollectionsService', function () {
            return {};
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
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
