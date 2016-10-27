describe('setting roles editor directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('rolesEditor', require('app/settings/roles/editor.directive'))
        .value('$routeParams', {
            id: 1
        })
        .value('$route', {
            reload: function () {}
        })
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        element = '<div roles-editor></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should to save a role', function () {
        spyOn(Notify, 'notify');

        $scope.saveRole({id: 'pass', name: 'admin'});

        expect(Notify.notify).toHaveBeenCalled();
    });

});
