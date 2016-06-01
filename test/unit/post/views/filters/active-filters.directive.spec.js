var ROOT_PATH = '../../../../../';

describe('post active filters directive', function () {

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

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        GlobalFilter = _GlobalFilter_;
        Notify = _Notify_;

        $scope.filters = {};

        element = '<post-active-filters filters="filters"></post-active-filters>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();

    }));

    describe('test directive functions', function () {
        it('should excute the set of transformers and return the correct values for each', function () {
            var transformers = ['tags', 'form', 'current_stage', 'set', 'center_point', 'created_before', 'created_after', 'fake'];
            var result = '';

            _.each(transformers, function (transformer) {

                if (_.contains(['tags', 'form', 'set', 'current_stage'], transformer)) {

                    result = isolateScope.transformFilterValue('test', transformer);
                    expect(result).toEqual('test');

                } else if (_.contains(['created_before', 'created_after'], transformer)) {

                    result = isolateScope.transformFilterValue('2016-02-17T18:06:46+00:00', transformer);
                    expect(result).toEqual('Feb 17, 2016');

                } else if (transformer === 'center_point') {
                    result = isolateScope.transformFilterValue('test', transformer);
                   // should be tested via e2e tests
                } else {
                    result = isolateScope.transformFilterValue('test', transformer);
                    expect(result).toEqual('test');
                }
            });
        });

        it('should convert a value into an array', function () {
            expect(isolateScope.makeArray('test')).toEqual(['test']);
        });

        it('should remove a given filter from the GlobalFilter object', function () {
            GlobalFilter.test = ['test'];
            isolateScope.removeFilter('test', 'test');

            expect(GlobalFilter.test.length).toEqual(0);
        });
    });
});
