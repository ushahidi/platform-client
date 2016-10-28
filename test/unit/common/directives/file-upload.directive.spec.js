var ROOT_PATH = '../../../../';

describe('file upload directive', function () {

    var $rootScope,
        $compile,
        $scope,
        $window,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('fileUpload', require(ROOT_PATH + 'app/common/directives/file-upload.directive'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

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
        element = '<file-upload></file-upload>';
        element = $compile(element)($scope);
        $scope.$digest();

    });
});
