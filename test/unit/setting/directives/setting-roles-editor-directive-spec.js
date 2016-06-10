var ROOT_PATH = '../../../../';

describe('setting roles editor directive', function () {

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

        testApp.directive('rolesEditor', require(ROOT_PATH + 'app/setting/directives/setting-roles-editor-directive'))
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

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
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
