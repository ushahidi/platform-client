describe('post export directive', function () {
    var element,
        template,
        $compile,
        $scope,
        $controller,
        $rootScope,
        isolateScope,
        myController,
        PostFilters,
        Notify,
        DataExport;

    beforeEach(function () {
        var testApp = makeTestApp();
        testApp.directive('postExport', require('app/map/post-toolbar/share/post-export.directive'));
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$compile_, _$rootScope_, _PostFilters_, _$controller_, _Notify_, _DataExport_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        PostFilters = _PostFilters_;
        DataExport = _DataExport_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        $scope.filters = [];
        element = angular.element('<post-export filters="filters"></post-export>');
        template = $compile(element)($scope);
        $scope.$digest();
        isolateScope = template.isolateScope();
        myController = element.controller('postExport');
        Notify = _Notify_;
    }));

    it ('Should be defined and have a valid filters property in its scope', function () {
        expect(template.html()).toContain('app.export_to_csv');
        expect(isolateScope).not.toBeUndefined();
        expect(isolateScope.filters).not.toBeUndefined();
        expect(isolateScope.filters).toEqual([]);
    });

    it('should throw an error if the getQuery function is not available', function () {
        spyOn(isolateScope, 'getQuery').and.callThrough();
        var query = isolateScope.getQuery();
        expect(query).not.toBeNull();
        expect(isolateScope.getQuery).toHaveBeenCalled();
    });

    it('Should return only default values when $scope.filter is empty ', function () {

        var query = isolateScope.getQuery();
        /**
         * Checking against each individual field
         * because it' going to give more meaningful error messages
         * if something breaks.
         */
        expect(query.filters.form).toEqual([1, 2]);
        expect(query.filters.q).toEqual('');
        expect(query.filters.date_after).toEqual('');
        expect(query.filters.date_before).toEqual('');
        expect(query.filters.published_to).toEqual('');
        expect(query.filters.center_point).toEqual('');
        expect(query.filters.has_location).toEqual('all');
        expect(query.filters.within_km).toEqual('1');
        expect(query.filters.current_stage).toEqual([]);
        expect(query.filters.tags).toEqual([]);
        expect(query.filters.set).toEqual([]);
        expect(query.filters.user).toEqual(false);
        expect(query.filters.status).toEqual(['published', 'draft']);
        $rootScope.$digest();
    });

    it ('Should call prepareExport function when user accepts the Notify confirmation prompt', function () {
        var query = {filters: isolateScope.getQuery()};
        spyOn(DataExport, 'startExport').and.callThrough();
        DataExport.startExport(query);
        expect(DataExport.startExport).toHaveBeenCalled();
    });
});
