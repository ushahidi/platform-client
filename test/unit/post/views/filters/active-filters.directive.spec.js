var ROOT_PATH = '../../../../../';

describe('post active filters directive', function () {

    var $rootScope,
        $scope,
        directiveScope,
        PostFilters,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock',
            'pascalprecht.translate'
        ]);

        testApp.directive('postActiveFilters', require(ROOT_PATH + 'app/post/views/filters/active-filters.directive'))
        .value('$filter', function () {
            return function () {
                return 'Feb 17, 2016';
            };
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _PostFilters_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        PostFilters = _PostFilters_;
        Notify = _Notify_;

        $scope.filters = {
            status: 'published',
            published_to: ''
        };

        element = '<post-active-filters></post-active-filters>';
        element = $compile(element)($scope);
        $scope.$digest();
        directiveScope = element.scope();
    }));

    describe('test directive functions', function () {
        it('should excute the set of transformers and return the correct values for each', function () {
            var transformers = ['tags', 'center_point', 'created_before', 'created_after', 'fake'];
            var result = '';

            _.each(transformers, function (transformer) {

                if (_.contains(['tags'], transformer)) {

                    result = directiveScope.transformFilterValue('test', transformer);
                    expect(result).toEqual('test');

                } else if (_.contains(['created_before', 'created_after'], transformer)) {

                    result = directiveScope.transformFilterValue('2016-02-17T18:06:46+00:00', transformer);
                    expect(result).toEqual('Feb 17, 2016');

                } else if (transformer === 'center_point') {
                    result = directiveScope.transformFilterValue('test', transformer);
                   // should be tested via e2e tests
                } else {
                    result = directiveScope.transformFilterValue('test', transformer);
                    expect(result).toEqual('test');
                }
            });
        });

        it('should remove a given filter from the PostFilters object', function () {
            spyOn(PostFilters, 'clearFilter');
            directiveScope.removeFilter('test', 'test');

            expect(PostFilters.clearFilter).toHaveBeenCalled();
        });
    });
});
