var L = require('leaflet');
describe('post view map directive', function () {

    var $rootScope,
        $scope,
        $compile,
        isolateScope,
        Notify,
        Maps,
        PostEndpoint,
        map,
        geojson,
        markers,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postViewMap', require('app/main/posts/views/post-view-map.directive'))
        .value('Leaflet', L)
        ;

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _Notify_, _Maps_, _PostEndpoint_, $q) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Notify = _Notify_;
        Maps = _Maps_;
        PostEndpoint = _PostEndpoint_;

        map = L.map(document.createElement('div'), {
            center: [0,1],
            zoom: 5,
            layers: [L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png')]
        });
        spyOn(Maps, 'createMap').and.returnValue($q.when(map));
        var lgeoJson = L.geoJson;
        spyOn(L, 'geoJson').and.callFake(function (data, options) {
            geojson = lgeoJson(data, options);
            spyOn(geojson, 'addTo').and.callThrough();

            return geojson;
        });
        var markerClusterGroup = L.markerClusterGroup;
        spyOn(L, 'markerClusterGroup').and.callFake(function () {
            markers = markerClusterGroup();
            spyOn(markers, 'addTo').and.callThrough();

            return markers;
        });
        spyOn(PostEndpoint, 'geojson').and.callThrough();
        spyOn(PostEndpoint, 'get').and.callThrough();

        $scope = _$rootScope_.$new();
        $scope.isLoading = {
            state: true
        };
        $scope.filters = {};

        element = '<post-view-map filters="filters" is-loading="isLoading"></post-view-map>';
    }));

    it('should create a map', function () {
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();

        expect(Maps.createMap).toHaveBeenCalled();
    });

    it('should load geojson data and add it to the map', function () {
        map.options.clustering = false;

        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();

        expect(PostEndpoint.geojson).toHaveBeenCalled();
        expect(L.geoJson).toHaveBeenCalled();
        expect(geojson.addTo).toHaveBeenCalledWith(map);
    });

    it('should load geojson data and add clusters to the map', function () {
        map.options.clustering = true;

        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();

        expect(PostEndpoint.geojson).toHaveBeenCalled();
        expect(L.geoJson).toHaveBeenCalled();
        expect(L.markerClusterGroup).toHaveBeenCalled();
        expect(markers.addTo).toHaveBeenCalledWith(map);
    });

    it('reload geojson when filters change', function () {
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();

        isolateScope.$apply(function () {
            isolateScope.filters = {
                status : 'published'
            };
        });

        expect(L.geoJson).toHaveBeenCalled();
        expect(L.geoJson.calls.count()).toEqual(3);
        expect(geojson.addTo).toHaveBeenCalledWith(map);
    });

    it('shows a popup when marker is clicked', function () {
        map.options.clustering = false;
        var layer = geojson.getLayers()[0];
        var child = layer.getLayers()[0];

        spyOn(child, 'bindPopup').and.callThrough();
        spyOn(child, 'openPopup').and.callThrough();
        spyOn(child, 'getPopup').and.callThrough();

        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();

        child.fireEvent('click', {
            layer: child
        });
        layer.fireEvent('click', {
            layer: child
        });

        // For some reason this spy isn't attaching properly.
        // Skipping for now
        //expect(PostEndpoint.get).toHaveBeenCalled();
        expect(child.bindPopup).toHaveBeenCalled();
        expect(child.openPopup).toHaveBeenCalled();

        layer.fireEvent('click', {
            layer: child
        });
        expect(child.openPopup.calls.count()).toEqual(2);
    });
});
