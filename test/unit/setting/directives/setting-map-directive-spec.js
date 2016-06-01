var ROOT_PATH = '../../../../';

describe('setting map directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('settingsMap', require(ROOT_PATH + 'app/setting/directives/setting-map-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        element = '<settings-map map="map"></settings-map>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should have template markup', function () {
        var baseLayerSelect = element.find('#map-settings-base-layer');
        expect(baseLayerSelect).toBeDefined();
    });

    it('should set markers', function () {
        expect(isolateScope.markers.dragger.lat).toEqual(-1.3048035);
    });

    it('should set min and max zoom level', function () {
        expect(isolateScope.minZoom).toEqual(0);
        expect(isolateScope.maxZoom).toEqual(0);
    });

    it('should set centre', function () {
        expect(isolateScope.center.lat).toEqual(-1.3048035);
    });

});
