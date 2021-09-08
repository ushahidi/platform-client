describe('collections mode context directive', function () {

    var $rootScope,
        $scope,
        element,
        Notify,
        isolateScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp
        .directive('collectionsModeContext', require('app/map/collections/mode-context.directive'))
        .service('CollectionsService', function () {
            return {};
        })
        .service('$state', () => {
            return {
                go: () => {}
            };
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;
        $scope.collection =  {
            allowed_privileges: 'update'
        };

        element = '<collections-mode-context collection="collection"></collections-mode-context>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should save a notification', function () {
        spyOn(Notify, 'notify');
        isolateScope.saveNotification({id: 'pass'});

        expect(Notify.notify).toHaveBeenCalled();
    });

});
