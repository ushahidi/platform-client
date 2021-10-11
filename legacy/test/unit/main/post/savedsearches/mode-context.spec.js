describe('savedsearch mode context directive', function () {

    var $rootScope,
        $scope,
        element,
        Notify,
        isolateScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp
        .directive('savedSearchModeContext', require('app/map/savedsearches/mode-context.directive'))
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

        $scope.savedSearch = {
            allowed_privileges: ['update']
        };
        element = '<saved-search-mode-context saved-search="savedSearch"></saved-search-mode-context>';
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
