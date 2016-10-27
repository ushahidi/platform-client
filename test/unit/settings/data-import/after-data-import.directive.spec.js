var ROOT_PATH = '../../../../';

describe('setting data after import directive', function () {

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

        testApp.directive('afterImportCsv', require(ROOT_PATH + 'app/settings/data-import/data-after-import.directive'))
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

        element = '<div after-import-csv></div>';
        element = $compile(element)($scope);
        $scope.$digest();
        $rootScope.$apply();
    }));

    beforeEach(function () {
        spyOn($rootScope, '$emit').and.callThrough();
    });

    it('should detect that the csv mappings are missing required fields', function () {
        $rootScope.$emit('event:import:complete', {collectionId: 1});

        expect($scope.collectionId).toEqual(1);
    });
});
