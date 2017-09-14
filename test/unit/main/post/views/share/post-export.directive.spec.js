describe('post export directive', function () {
    var element,
        $compile,
        $scope,
        $controller,
        $rootScope,
        isolateScope,
        PostEndpoint,
        myController,
        $httpBackend;

    beforeEach(function () {
        var testApp = makeTestApp();
        testApp.directive('postExport', require('app/main/posts/views/share/post-export.directive'));
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$compile_, _$rootScope_, _PostEndpoint_, _$controller_, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        PostEndpoint = _PostEndpoint_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        $scope.filters = [];
        element = $compile('<post-export filters="filters"></post-export>')($scope);
        isolateScope = element.isolateScope();

        myController = element.controller('postExportDirective');

    }));

    it ('Should be defined and have a valid filters property in its scope', function () {
        $rootScope.$digest();
        expect(element.html()).toContain('app.export_to_csv');
        expect(isolateScope).not.toBeUndefined();
        expect(isolateScope.filters).not.toBeUndefined();
        expect(isolateScope.filters).toEqual([]);
    });

    it ('should replace filters', function () {
        expect(element.scope.status).toBeDefined();
    });

});

describe('postExportDirective', function() {
    var el, scope, controller;

    beforeEach(inject(function ($compile, $rootScope) {
        // Instantiate directive.
        // gotacha: Controller and link functions will execute.
        el = angular.element('<post-export filters="filters"></post-export>');
        $compile(el)($rootScope.$new())
        $rootScope.$digest()

        // Grab controller instance
        controller = el.controller('postExportDirective');
        console.log(el,controller);
        // Grab scope. Depends on type of scope.
        // See angular.element documentation.
        scope = el.isolateScope() || el.scope();
    }));

    it('should do something to the scope', function () {
        expect(scope.status).toBeDefined();
    });
});