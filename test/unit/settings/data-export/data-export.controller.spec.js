describe('data-export-controller', function () {

    var  $scope,
        $rootScope,
        $controller,
        $location,
        DataExport,
        Notify,
        FormEndpoint,
        FormAttributeEndpoint;

    beforeEach(function () {

        var testApp = makeTestApp();
        testApp.controller('data-export-controller', require('app/settings/data-export/data-export.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _$location_, _DataExport_, _Notify_, _FormEndpoint_, _FormAttributeEndpoint_, _) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $location = _$location_;
        DataExport = _DataExport_;
        Notify = _Notify_;
        FormEndpoint = _FormEndpoint_;
        FormAttributeEndpoint = _FormAttributeEndpoint_;
        $scope = _$rootScope_.$new();

        $rootScope.hasPermission = function () {
            return true;
        };
    }));

    beforeEach(function () {
        $rootScope.setLayout = function () {};
        $controller('data-export-controller', {
            $scope: $scope,
            $rootScope: $rootScope
        });

        $rootScope.setLayout = function () {};

        $rootScope.$digest();
        $rootScope.$apply();
    });

    describe ('exportAll-function', function () {
        it('should initate data-export', function () {
            spyOn(DataExport, 'startExport');
            $scope.exportAll();
            expect(DataExport.startExport).toHaveBeenCalledWith({});
        });
        it('should show progress', function () {
            expect($scope.showProgress).toEqual(false);
            $scope.exportAll();
            expect($scope.showProgress).toEqual(true);
        });
    });
    describe('selectFields-function', function () {
        it('should toggle the showFields-value', function () {
            var value = Math.random() < 0.5;
            $scope.showFields = value;
            expect($scope.showFields).toEqual(value);
            $scope.selectFields();
            expect($scope.showFields).toEqual(!value);
        });
    });
    describe('getForms-function', function () {
        it('should get all available forms', function () {
            spyOn(FormEndpoint, 'queryFresh').and.callThrough();
            $scope.getForms();
            expect(FormEndpoint.queryFresh).toHaveBeenCalled();
            expect($scope.forms.length).toEqual(2);
        });
        it('should call attachAttributes when done fetching forms', function () {
            spyOn($scope, 'attachAttributes');
            $scope.getForms();
            expect($scope.attachAttributes).toHaveBeenCalled();
        });
    });
    describe('exportSelected-function', function () {
        it('should notify user if no fields are selected', function () {
            $scope.selectedFields = [];
            spyOn(Notify, 'exportNotifications');
            $scope.exportSelected();
            expect(Notify.exportNotifications).toHaveBeenCalled();
        });
        it('should call startExport with the selectedFields', function () {
            $scope.selectedFields = [1, 4, 7, 8, 10];
            spyOn(DataExport, 'startExport');
            $scope.exportSelected();
            expect(DataExport.startExport).toHaveBeenCalledWith({attributes: $scope.selectedFields});
        });
    });
    describe('attachAttributes-function', function () {
        it('should fetch attributes-endpoint', function () {
            spyOn(FormAttributeEndpoint, 'query').and.callThrough();
            $scope.forms = [{id: 1}, {id: 2}, {id: 3}];
            $scope.attachAttributes();
            expect(FormAttributeEndpoint.query.calls.count()).toEqual(3);
        });
    });
    describe('selectAll-function', function () {
        it('should add form to selectedFields if its not there', function () {
            $scope.selectedFields = [];
            expect($scope.selectedFields[5]).toBeUndefined();
            $scope.selectAll({id: 5, attributes: [1,2]});
            expect($scope.selectedFields[5]).toBeDefined();
        });
        it('should remove attributes from selectedFields if they are already there', function () {
            $scope.selectedFields[5] = [1,3,5];
            $scope.selectAll({id: 5, attributes: [{id: 1}, {id: 3}, {id: 5}]});
            expect($scope.selectedFields[5]).toEqual([]);
        });
        it('should add all attributes to selectedFields if only some are selected', function () {
            $scope.selectedFields[5] = [1,3];
            $scope.selectAll({id: 5, attributes: [{id: 1}, {id: 3}, {id: 5}]});
            expect($scope.selectedFields[5]).toEqual([1, 3, 5]);
        });
        it('should add all attributes to selectedFields if none is selected', function () {
            $scope.selectedFields[4] = [];
            $scope.selectAll({id: 4, attributes: [{id: 1}, {id: 3}, {id: 5}]});
            expect($scope.selectedFields[4]).toEqual([1, 3, 5]);
        });
    });
});
