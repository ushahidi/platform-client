describe('role-selector directive', function () {
    var $rootScope,
        $scope,
        $compile,
        RoleEndpoint,
        element,
        isolateScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();
        testApp.directive('roleSelector', require('app/common/directives/role-selector.directive.js'));
        angular.mock.module('testApp');
    });
    beforeEach(inject(function (_$rootScope_, _$compile_, _RoleEndpoint_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        RoleEndpoint = _RoleEndpoint_;
        spyOn(RoleEndpoint, 'query').and.callThrough();

        $scope = _$rootScope_.$new();
        $scope.title = 'This is title';
        $scope.model = {};
        element = '<role-selector title="title" model="model"></role-selector>';

        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();

        spyOn(isolateScope, 'setEveryone').and.callThrough();
    }));

    it('should add the role-selector-template', function () {
        expect(isolateScope.title).toEqual('This is title');
        expect(isolateScope.model).toEqual({});
    });

    it('should fetch all roles from RoleEndpoint', function () {
        expect(RoleEndpoint.query).toHaveBeenCalled();
    });

    it('should add all roles when clicking on "everyone"', function () {
        var change = new Event('click');
        var elementToClick = element[0].querySelector('#add_everyone');
        elementToClick.dispatchEvent(change);
        expect(isolateScope.setEveryone).toHaveBeenCalled();
        expect(isolateScope.model.role).toEqual([]);
    });
});
