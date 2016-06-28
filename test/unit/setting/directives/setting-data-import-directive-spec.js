var ROOT_PATH = '../../../../';

describe('setting data import directive', function () {

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

        testApp.directive('importerCsv', require(ROOT_PATH + 'app/setting/directives/setting-data-import-directive'))
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

        $scope.formId = 'pass';

        $scope.importCSV();

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should require that a file is uploaded', function () {
        spyOn(Notify, 'error');
        $scope.fileContainer = {
            file: undefined
        };
        $scope.importCSV();
        expect(Notify.error).toHaveBeenCalled();
    });
});
