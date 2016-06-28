var ROOT_PATH = '../../../../';

describe('post location directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        GlobalFilter,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock',
            'pascalprecht.translate'
        ]);

        testApp.directive('postLocation', require(ROOT_PATH + 'app/post/modify/post-location.directive'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        GlobalFilter = _GlobalFilter_;
        Notify = _Notify_;

        $scope.post = {};
        element = '<post-location attribute="attribute" key="key"></post-location>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();

    }));
});
