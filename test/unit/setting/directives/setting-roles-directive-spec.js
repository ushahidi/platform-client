var ROOT_PATH = '../../../../';

describe('setting roles directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('roles', require(ROOT_PATH + 'app/setting/directives/setting-roles-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        element = '<div roles></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should check if the role to be deleted is the last admin', function () {
        $scope.roles.push({
            name: 'admin',
            id: 2
        });
        var result = $scope.checkIfLastAdmin();
        expect(result).toBe(true);
    });

    it('should delete a given role', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.deleteRole({id: 'pass', name: 'test'});

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should not delete the last admin', function () {
        spyOn(Notify, 'showSingleAlert');
        $scope.roles.push({
            name: 'admin',
            id: 2
        });

        $scope.deleteRole({id: 2, name: 'admin'});

        expect(Notify.showSingleAlert).toHaveBeenCalled();
    });

});
