var ROOT_PATH = '../../../../';

describe('layout class directive', function () {

    var $rootScope,
        $compile,
        $scope,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('layoutClass', require(ROOT_PATH + 'app/common/directives/layout-class.directive'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, _$compile_, _Notify_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $scope = _$rootScope_.$new();

        $rootScope.setLayout = function () {};
        spyOn($rootScope, 'setLayout').and.callThrough();
    }));

    it('should set the layout', function () {
        element = '<layout-class layout="b"></layout-class>';
        element = $compile(element)($scope);
        $scope.$digest();

        expect($rootScope.setLayout).toHaveBeenCalledWith('layout-b');
    });

    it('should set the layout to "c"', function () {
        element = '<layout-class layout="c"></layout-class>';
        element = $compile(element)($scope);
        $scope.$digest();

        expect($rootScope.setLayout).toHaveBeenCalledWith('layout-c');
    });
});
