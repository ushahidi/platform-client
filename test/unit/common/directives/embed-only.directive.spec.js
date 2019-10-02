describe('embed only directive', function () {

    var $rootScope,
        $compile,
        $scope,
        $window,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.directive('embedOnly', require('app/common/directives/embed-only.directive'))
        .service('Embed', function () {
            return {
                'isEmbed': function () {
                    return false;
                }
            };
        });

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

    it('should set hide the element if embed-only is true', function () {
        element = '<div embed-only=true></div>';
        element = $compile(element)($scope);
        expect(element.hasClass('hidden')).toBe(true);
        $scope.$digest();
    });
    it('should set display the element if embed-only is false', function () {
        element = '<div embed-only=false></div>';
        element = $compile(element)($scope);
        expect(element.hasClass('hidden')).toBe(false);
        $scope.$digest();
    });
});
