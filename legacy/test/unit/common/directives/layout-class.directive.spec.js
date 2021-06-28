describe('layout class directive', function () {

    var $rootScope,
        $compile,
        $scope,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('layoutClass', require('app/common/directives/layout-class.directive'));

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _Notify_, _GlobalFilter_) {
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

        expect($rootScope.setLayout).toHaveBeenCalledWith('layout-embed layout-b');
    });

    it('should set the layout to "c"', function () {
        element = '<layout-class layout="c"></layout-class>';
        element = $compile(element)($scope);
        $scope.$digest();

        expect($rootScope.setLayout).toHaveBeenCalledWith('layout-embed layout-c');
    });
});
