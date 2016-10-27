describe('setting data import directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('importerCsv', require('app/settings/data-import/data-import.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        element = '<div importer-csv></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should attempt to import a csv', function () {
        spyOn(Notify, 'notify');

        $scope.fileContainer = {
            file: {
                name: 'test csv'
            }
        };

        $scope.selectedForm = {id: 'pass'};

        $scope.completeStepOne();

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should require that a file is uploaded', function () {
        spyOn(Notify, 'error');
        $scope.fileContainer = {
            file: undefined
        };
        $scope.completeStepOne();
        expect(Notify.error).toHaveBeenCalled();
    });

    it('should detect that the csv mappings are empty', function () {
        spyOn(Notify, 'error');
        $scope.csv = {};
        $scope.csv.maps_to = {};
        $scope.completeStepTwo();

        expect(Notify.error).toHaveBeenCalled();
    });

    it('should detect that the csv mappings contain duplicates', function () {
        spyOn(Notify, 'error');
        $scope.csv = {};
        $scope.csv.maps_to = [];
        $scope.csv.columns = [
            'column A',
            'column B'
        ];
        $scope.maps_to = {
            'Field 1': 0,
            'Field 2': 0
        };
        $scope.completeStepTwo();

        expect(Notify.error).toHaveBeenCalled();
    });

    it('should detect that the csv mappings are missing required fields', function () {
        spyOn(Notify, 'error');
        $scope.csv = {};
        $scope.csv.maps_to = [];
        $scope.csv.columns = [
            'column A',
            'column B'
        ];
        $scope.maps_to = {
            'field_1': 0,
            'field_2': 1
        };
        $scope.required_fields = [
            'field_3'
        ];
        $scope.required_fields_map = {
            'field_3': 'Field 3'
        };

        $scope.completeStepTwo();

        expect(Notify.error).toHaveBeenCalled();
    });
});
