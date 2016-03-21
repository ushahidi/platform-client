var ROOT_PATH = '../../../../';

describe('post view tabs directive', function () {

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
            'ushahidi.mock'
        ]);

        testApp.directive('postViewTabs', require(ROOT_PATH + 'app/post/directives/post-view-tabs-directive'))
        .service('PostViewHelper', require(ROOT_PATH + 'app/common/services/view-helper.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        GlobalFilter = _GlobalFilter_;
        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');

        element = '<post-view-tabs></post-view-tabs>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
    }));

    describe('test directive functions', function () {
        it('should set the list of available tabs', function () {
            expect(isolateScope.views.length).toEqual(0);
        });
    });
});
