var ROOT_PATH = '../../../../';

describe('setting data mapper directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('mapperCsv', require(ROOT_PATH + 'app/setting/directives/setting-data-mapper-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        element = '<div mapper-csv></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should check required fields', function () {
        $scope.required_fields = ['test', 'test 2'];
        $scope.required_fields_map = {
            'test': 'Test',
            'test 2': 'Test 2'
        };
        var fields = ['a', 'b', 'test'];
        var result = $scope.checkRequiredFields(fields);
        expect(result).toEqual(['Test 2']);
    });

    it('should detect duplicate field assignments', function () {
        spyOn(Notify, 'error');

        var csv = {
            maps_to: [
                'test',
                'test'
            ]
        };
        $scope.progressToConfigure(csv);

        expect(Notify.error).toHaveBeenCalled();
    });

    it('should detect missing field assignments', function () {
        spyOn(Notify, 'error');

        var csv = {
            maps_to: [
                'test'
            ]
        };

        $scope.required_fields = ['test', 'test 2'];
        $scope.required_fields_map = {
            'test': 'Test',
            'test 2': 'Test 2'
        };

        $scope.progressToConfigure(csv);

        expect(Notify.error).toHaveBeenCalled();
    });

    it('should cancel the import', function () {
        spyOn(Notify, 'notify');
        $scope.cancelImport();
        expect(Notify.notify).toHaveBeenCalled();
    });
});
