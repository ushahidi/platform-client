describe('Category Directive', function () {
    var $rootScope,
        $scope,
        directiveScope,
        PostFilters,
        Notify,
        element,
        $compile;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('filterCategory', require('app/map/post-toolbar/filters/filter-category.directive'))
            .service('PostFilters', require('app/common/services/post-filters.service.js'));
        angular.mock.module('testApp');
    });

    var defaults = {
        q: '',
        date_after: '',
        date_before: '',
        status: ['published', 'draft'],
        published_to: '',
        center_point: '',
        has_location: 'all',
        within_km: '1',
        current_stage: [],
        tags: [1, 2, 3, 4, 5],
        saved_search: '',
        orderby: 'created',
        order: 'desc',
        order_unlocked_on_top: 'true',
        form: [1, 2, 3, 4],
        set: [],
        user: false,
        source: ['sms', 'twitter','web', 'email', 'whatsapp', 'ussd']
    };

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _Notify_, _PostFilters_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        PostFilters = _PostFilters_;
        Notify = _Notify_;
        $rootScope.filters = defaults;
        $scope.filters = defaults;
        $scope.parents = [{id: 1, children: [{id: 2}, {id: 4}, {id: 5}]}, {id: 3, children: []}];
        element = '<filter-category ng-model="$scope.filters.tags"></filter-category>';
        element = $compile(element)($scope);
        $scope.$digest();
        $rootScope.$digest();
        directiveScope = element.isolateScope();
        directiveScope.parents = [{id: 1, children: [{id: 2}, {id: 4}, {id: 5}]}, {id: 3, children: []}];
    }));

    describe('test internallyModified flag', function () {
        it('should return the same result as the newSelection variable when internallyModified==true', function () {
            PostFilters.filtersInternalChange = true;
            directiveScope.parents = [{id: 1, children: [{id: 2}, {id: 4}, {id: 5}]}, {id: 3, children: []}];
            $scope.filters.tags = [1,2,3];
            const result = directiveScope.handleParents([1,2,3], [1,2]);
            expect(result).toEqual([1, 2, 3]);
        });
    });

    describe('selecting and unselecting parents with no children works when internallyModified==false', function () {
        it('should return the same result as the newSelection var when I unselect a parent', function () {
            PostFilters.filtersInternalChange = false;
            let newSelection = [1, 2];
            let oldSelection = [1, 2, 3];
            $scope.filters.tags = newSelection;
            const result = directiveScope.handleParents(newSelection, oldSelection);
            expect(result).toEqual([1, 2]);
        });
        it('should return the same result as the newSelection var when I select a parent', function () {
            PostFilters.filtersInternalChange = false;
            let newSelection = [1, 2, 3];
            let oldSelection = [1, 2];
            $scope.filters.tags = newSelection;
            const result = directiveScope.handleParents(newSelection, oldSelection);
            expect(result).toEqual([1, 2, 3]);
        });
    });
    describe('selecting and unselecting children works when internallyModified==false', function () {
        it('should unselect the parent when I unselect a child', function () {
            let newSelection = [1, 3];
            let oldSelection = [1, 2, 3];
            PostFilters.filtersInternalChange = false;
            $scope.filters.tags = newSelection;
            const result = directiveScope.handleParents(newSelection, oldSelection);
            expect(result).toEqual([3]);
        });
        it('should select the parent when I select all its children', function () {
            let newSelection = [2, 3, 4, 5];
            let oldSelection = [3, 4, 5];
            PostFilters.filtersInternalChange = false;
            $scope.filters.tags = newSelection;
            const result = directiveScope.handleParents(newSelection, oldSelection);
            expect(result).toEqual([2, 3, 4, 5, 1]); // order changed because we pushed the '1'
        });

        it('should not select the parent when I select only one of its children', function () {
            PostFilters.filtersInternalChange = false;
            let newSelection = [3, 4, 5];
            let oldSelection = [3, 4, 5];
            $scope.filters.tags = newSelection;
            const result = directiveScope.handleParents(newSelection, oldSelection);
            expect(result).toEqual([3, 4, 5]);
        });
    });
    describe('selecting and unselecting parents with children works when internallyModified==false', function () {
        it('should unselect the children when I unselect the parent', function () {
            PostFilters.filtersInternalChange = false;
            let newSelection = [2, 3, 4, 5];
            let oldSelection = [1, 2, 3, 4, 5];
            $scope.filters.tags = newSelection;
            const result = directiveScope.handleParents(newSelection, oldSelection);
            expect(result).toEqual([3]);
        });
        it('should select all the children when I select the parent', function () {
            PostFilters.filtersInternalChange = false;
            let newSelection = [1, 3];
            let oldSelection = [3];
            $scope.filters.tags = newSelection;
            const result = directiveScope.handleParents(newSelection, oldSelection);
            expect(result).toEqual([1, 3, 2, 4, 5]);
        });
    });

});
