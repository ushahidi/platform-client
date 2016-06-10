var ROOT_PATH = '../../../../';

describe('setting data configure directive', function () {

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

        testApp.directive(
            'configureCsv',
            require(ROOT_PATH + 'app/setting/directives/setting-data-configure-directive'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        //Set initial values
        $scope.csv = {
            id: 'pass'
        };
        $scope.csv.fixed = {};
        $scope.csv.fixed.form = 1;
        $scope.csv.fixed.values = {};

        element = '<div configure-csv></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should attempt to import a csv', function () {
        spyOn(Notify, 'notify');

        $scope.csv = {
            id: 'pass'
        };

        $scope.triggerImport();

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should import the mappings', function () {
        spyOn(Notify, 'notify');

        $scope.post.values = {
            'test': 'test'
        };

        $scope.submitMappings({id: 'pass', maps_to: ['test']});

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should cancel the import', function () {
        spyOn(Notify, 'notify');
        $scope.cancelImport();
        expect(Notify.notify).toHaveBeenCalled();
    });
});
