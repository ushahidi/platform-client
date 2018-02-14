describe('category-selector directive with enableParents=true', function () {
    var $rootScope,
        $scope,
        $compile,
        element,
        isolateScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();
        testApp.directive('categorySelector', require('app/common/directives/category-selector.directive.js'));
        angular.mock.module('testApp');
    });
    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $scope.available = [
            {
                id: 1,
                tag: '1',
                children: [
                    {id: 2, parent_id: 1, tag: '2'},
                    {id: 4, parent_id: 1, tag: '4'},
                    {id: 5, tag: '5', parent_id: 1}
                ]
            },
            {
                id: 3, tag: '3', children: []
            }
        ];
        $scope.selected = [];
        $scope.form = {
            $setDirty: function () {
                return true;
            }
        };
        element = $compile(
            angular.element('<category-selector enable-parents="true" available="available" selected="selected" form="form"></category-selector>')
        )($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should have the selected array', function () {
        expect(isolateScope.selected).toEqual([]);
    });
    it ('should have categories=2, selected=0 and selectedParents=0 when first loaded', function () {
        expect(isolateScope.categories.length).toBe(2);
        expect(isolateScope.selectedParents.length).toBe(0);
        expect(isolateScope.selected.length).toBe(0);
    });

    it ('should have not select parents in selected array when I select a child', function () {
        isolateScope.selected.push(2);
        $scope.$digest();
        expect(isolateScope.selected.length).toBe(1);
        expect(isolateScope.selectedParents.length).toBe(0);
    });

    it ('should have set the selectedParent in scope.selectedParents, if I call changeCategories after selecting a child', function () {
        isolateScope.selected.push(2);
        $scope.$digest();
        isolateScope.changeCategories();
        expect(isolateScope.selectedParents.length).toBe(1);
        expect(isolateScope.selected.length).toBe(2);
        // the parent should be disabled
        expect(isolateScope.disabledCategories[1]).toBe(false);
    });

    it ('should unselect the selectedParent in scope.selectedParents, if I unselect the child and call changeCategories', function () {
        isolateScope.selected = [];
        $scope.$digest();
        isolateScope.changeCategories();
        expect(isolateScope.selected.length).toBe(0);
        expect(isolateScope.selectedParents.length).toBe(0);
    });

    it ('should not add to selectedParents, if I select a parent with no children', function () {
        isolateScope.selected = [3];
        $scope.$digest();
        isolateScope.changeCategories();
        expect(isolateScope.selectedParents.length).toBe(0);
        // the selected item should not be disabled
        expect(isolateScope.disabledCategories[3]).toBe(false);
    });
});
