var ROOT_PATH = '../../../../';

describe('post view filters directive', function () {

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

        testApp.directive('postViewFilters', require(ROOT_PATH + 'app/post/directives/post-view-filters-directive'))
        .value('Geocoding', {
            search: function () {}
        })
        .value('$filter', function () {
            return function () {};
        });

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

        element = '<post-view-filters half-width="false" has-aside="hasAside" is-loading="isLoading"></post-view-filters>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
    }));

    describe('test directive functions', function () {
        it('should clear different filters', function () {
            isolateScope.clearFilters();

            isolateScope.showAllTagsHandler();
            expect(GlobalFilter.tags).toEqual([]);

            isolateScope.showAllFormsHandler();
            expect(GlobalFilter.form).toEqual([]);

            isolateScope.showAllPostStagesHandler();
            expect(GlobalFilter.current_stage).toEqual([]);

            isolateScope.showAllCollectionsHandler();
            expect(GlobalFilter.set).toEqual([]);

        });
    });
});
