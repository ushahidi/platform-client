describe('post export directive', function () {
    var element,
        template,
        $compile,
        $scope,
        $controller,
        $rootScope,
        isolateScope,
        PostEndpoint,
        $q,
        myController,
        PostFilters,
        Notify;

    beforeEach(function () {
        var testApp = makeTestApp();
        testApp.directive('postExport', require('app/main/posts/views/share/post-export.directive'));
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$compile_, _$rootScope_, _PostEndpoint_, _PostFilters_, _$controller_, _Notify_, _$q_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        PostEndpoint = _PostEndpoint_;
        PostFilters = _PostFilters_;
        $controller = _$controller_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
        $scope.filters = [];
        element = angular.element('<post-export filters="filters"></post-export>');
        template = $compile(element)($scope);
        $scope.$digest();
        isolateScope = template.isolateScope();
        myController = element.controller('postExport');
        Notify = _Notify_;
    }));


    it ('should have a loading property', function () {
        expect(isolateScope.loading).toBeDefined();
        expect(isolateScope.loading).toBeFalsy();
    });

    it ('Should be defined and have a valid filters property in its scope', function () {
        expect(template.html()).toContain('app.export_to_csv');
        expect(isolateScope).not.toBeUndefined();
        expect(isolateScope.filters).not.toBeUndefined();
        expect(isolateScope.filters).toEqual([]);
    });

    it('Should show confirmation alert when I call exportPostsConfirmation', function () {
        isolateScope = element.isolateScope();
        spyOn(isolateScope, 'exportPostsConfirmation').and.callThrough();
        spyOn(Notify, 'confirm').and.callThrough();
        var clickEv = new Event('click');
        template[0].getElementsByTagName('a')[0].dispatchEvent(clickEv);
        expect(isolateScope.exportPostsConfirmation).toHaveBeenCalled();
        expect(Notify.confirm).toHaveBeenCalled();
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
        expect(query.format).toEqual('csv');
        expect(query.form).toEqual([1, 2]);
        expect(query.q).toEqual('');
        expect(query.date_after).toEqual('');
        expect(query.date_before).toEqual('');
        expect(query.published_to).toEqual('');
        expect(query.center_point).toEqual('');
        expect(query.has_location).toEqual('all');
        expect(query.within_km).toEqual('1');
        expect(query.current_stage).toEqual([]);
        expect(query.tags).toEqual([]);
        expect(query.set).toEqual([]);
        expect(query.user).toEqual(false);
        expect(query.status).toEqual(['published', 'draft']);
        $rootScope.$digest();
    });

    it ('Should call prepareExport function when user accepts the Notify confirmation prompt', function () {
        var query = isolateScope.getQuery();
        spyOn(isolateScope, 'prepareExport').and.callThrough();
        spyOn(isolateScope, 'requestExport').and.callThrough();
        spyOn(PostEndpoint, 'export');
        isolateScope.prepareExport();
        expect(isolateScope.prepareExport).toHaveBeenCalled();
        expect(PostEndpoint.export).toHaveBeenCalledWith(query);
        expect(isolateScope.loading).toBeTruthy();
    });


    it ('Should call loadingStatus when I call showCSVResults', function () {
        spyOn(isolateScope, 'loadingStatus').and.callThrough();
        isolateScope.showCSVResults([{name: 'csvFile'}, {data: 'my fake csv heading'}], 'csv');
        expect(isolateScope.loading).toBeFalsy();
        expect(isolateScope.loadingStatus).toHaveBeenCalled();
    });

    it ('Should return a valid file name when I call showCSVResults', function () {
        var oldDate = new Date();
        spyOn(window, 'Date').and.callFake(function () {
            return oldDate;
        });
        spyOn(isolateScope, 'showCSVResults').and.callThrough();
        var fileName = isolateScope.showCSVResults([{name: 'csvFile'}, {data: 'my fake csv heading'}], 'csv');
        expect(fileName).toEqual('csvFile' + '-' + (new Date()).toISOString().substring(0, 10) + '.' + 'csv');
    });


});
