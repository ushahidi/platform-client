var ROOT_PATH = '../../../../../';

describe('post view map directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postViewMap', require('app/main/posts/views/post-view-map.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        $scope.isLoading = true;
        $scope.filters = {};
        element = '<post-view-map filters="filters" is-loading="isLoading"></post-view-map>';

        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load initial values', function () {
        expect(isolateScope.isLoading).toBe(false);
    });
});
