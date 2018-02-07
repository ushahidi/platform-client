describe('Category Selection Service', function () {

    var $rootScope,
        $scope,
        CategorySelectionService;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.service('CategorySelectionService', require('app/main/posts/views/filters/filter-category.service.js'));
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, $compile, _CategorySelectionService_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        CategorySelectionService = _CategorySelectionService_;
    }));

    describe('test internallyModified flag', function () {
        it('should return the same result as the newSelection variable when internallyModified==true', function () {
            let scope = {parents: [{id: 2, children: [{id: 2}]}, {id: 3, children: []}], internallyModified: true};
            const result = CategorySelectionService.handleParents([1,2,3], [1,2], scope);
            expect(result).toEqual({internallyModified: true, result: [1, 2, 3]});
        });
    });

    describe('selecting and unselecting parents with no children works when internallyModified==false', function () {
        it('should return the same result as the newSelection var when I unselect a parent', function () {
            let newSelection = [1, 2];
            let oldSelection = [1, 2, 3];
            let scope = {parents: [{id: 1, children: {id: 2}}, {id: 3, children: []}], internallyModified: false};
            const result = CategorySelectionService.handleParents(newSelection, oldSelection, scope);
            expect(result).toEqual({internallyModified: true, result: [1, 2]});
        });
        it('should return the same result as the newSelection var when I select a parent', function () {
            let newSelection = [1, 2, 3];
            let oldSelection = [1, 2];
            let scope = {parents: [{id: 1, children: [{id: 2}]}, {id: 3, children: []}], internallyModified: false};
            const result = CategorySelectionService.handleParents(newSelection, oldSelection, scope);
            expect(result).toEqual({internallyModified: true, result: [1, 2, 3]});
        });
    });
    describe('selecting and unselecting children works when internallyModified==false', function () {
        it('should unselect the parent when I unselect a child', function () {
            let newSelection = [1, 3];
            let oldSelection = [1, 2, 3];
            let scope = {parents: [{id: 1, children: [{id: 2}]}, {id: 3, children: []}], internallyModified: false};
            const result = CategorySelectionService.handleParents(newSelection, oldSelection, scope);
            expect(result).toEqual({internallyModified: true, result: [3]});
        });
        it('should select the parent when I select all its children', function () {
            let newSelection = [2, 3, 4, 5];
            let oldSelection = [3, 4, 5];
            let scope = {parents: [{id: 1, children: [{id: 2}, {id: 4}, {id: 5}]}, {id: 3, children: []}], internallyModified: false};
            const result = CategorySelectionService.handleParents(newSelection, oldSelection, scope);
            expect(result).toEqual({internallyModified: true, result: [2, 3, 4, 5, 1]}); // order changed because we pushed the '1'
        });

        it('should not select the parent when I select only one of its children', function () {
            let newSelection = [3, 4, 5];
            let oldSelection = [3, 4, 5];
            let scope = {parents: [{id: 1, children: [{id: 2}, {id: 4}, {id: 5}]}, {id: 3, children: []}], internallyModified: false};
            const result = CategorySelectionService.handleParents(newSelection, oldSelection, scope);
            expect(result).toEqual({internallyModified: false, result: [3, 4, 5]});
        });
    });
    describe('selecting and unselecting parents with children works when internallyModified==false', function () {
        it('should unselect the children when I unselect the parent', function () {
            let newSelection = [2, 3, 4, 5];
            let oldSelection = [1, 2, 3, 4, 5];
            let scope = {parents: [{id: 1, children: [{id: 2}, {id: 4}, {id: 5}]}, {id: 3, children: []}], internallyModified: false};
            const result = CategorySelectionService.handleParents(newSelection, oldSelection, scope);
            expect(result).toEqual({internallyModified: true, result: [3]});
        });
        it('should select all the children when I select the parent', function () {
            let newSelection = [1, 3];
            let oldSelection = [3];
            let scope = {parents: [{id: 1, children: [{id: 2}, {id: 4}, {id: 5}]}, {id: 3, children: []}], internallyModified: false};
            const result = CategorySelectionService.handleParents(newSelection, oldSelection, scope);
            expect(result).toEqual({internallyModified: true, result: [1, 3, 2, 4, 5]});
        });
    });

});
