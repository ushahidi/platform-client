describe('embed only directive', function () {

    var $rootScope,
        $compile,
        $scope,
        $window,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.directive('embedOnly', require('app/common/directives/embed-only.directive'));

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$compile_, _Notify_, _GlobalFilter_, _$window_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $window = _$window_;
        $scope = _$rootScope_.$new();
        $rootScope.globalLayout = 'layout-a';
        $window.self = 'frame';
        $rootScope.setLayout = function () {};
        spyOn($rootScope, 'setLayout').and.callThrough();
    }));

    it('should set the layout', function () {
        element = '<div embed-only></div>';
        element = $compile(element)($scope);
        $scope.$digest();

    });
});
