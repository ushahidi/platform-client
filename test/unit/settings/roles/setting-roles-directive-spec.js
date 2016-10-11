var ROOT_PATH = '../../../../';

describe('setting roles directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require('test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('roles', require('app/settings/roles/roles.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require('test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $rootScope.setLayout = function () {};
        Notify = _Notify_;

        element = '<div roles></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('shuld refresh the view', function () {
        $scope.refreshView();
        expect($scope.roles.length).toEqual(1);
    });

});
