describe('file upload directive', function () {

    var $rootScope,
        $compile,
        $scope,
        $window,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.directive('fileUpload', require('app/common/directives/file-upload.directive'));

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$compile_, _$window_) {
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
        element = '<file-upload></file-upload>';
        element = $compile(element)($scope);
        $scope.$digest();

    });
});
