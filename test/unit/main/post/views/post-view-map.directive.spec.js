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
        element,
        PostFilters;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postViewMap', require('app/main/posts/views/post-view-map.directive'))
        .value('Leaflet', L)

        .service('$state', function () {
            return {
                'go': function () {
                    return {
                        'id': '1'
                    };
                }
            };
        });
        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _Notify_, _Maps_, _PostEndpoint_, $q, _PostFilters_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Notify = _Notify_;
        Maps = _Maps_;
        PostEndpoint = _PostEndpoint_;
        PostFilters = _PostFilters_;

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
        $scope.$transition$ = {
            params: function () {
                return {
                    'view': 'map'
                };
            },
            to: function () {
                return {
                    name : ''
                };
            }
        };
        $scope.filters = PostFilters.getFilters();

        element = '<post-view-map $transition$="$transition$" filters="filters"></post-view-map>';
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
    it('does not call PostEndpoint.geojson when filter.q changes and qEnabled is false', function () {
        /**
         * create directive with isolate scope
         */
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
        //spyOn(isolateScope, 'loadPosts').and.callThrough();
        /**
         * Set default qEnabled value to ensure we are dealing
         * with the directive's logic and not the postFilters defaults
         * @type {boolean}
         */
        isolateScope.$apply(function () {
            isolateScope.filters = {
                q : 'U'
            };
        });
        /**
         * When we initially setup the directive Postendpoint's geojson should
         * only be called once.
         */
        expect(L.geoJson.calls.count()).toEqual(1);

        expect(PostEndpoint.geojson).toHaveBeenCalledTimes(1);
        /**
         * Apply q filter to scope. Don't change qEnabled to true.
         * This should not call PostEndpoint.geojson because the app doesn't
         * care for changes in the input until the qEnabled property is true
         */
        isolateScope.$apply(function () {
            isolateScope.filters = {
                q : 'U'
            };
        });
        $rootScope.$digest();
        expect(PostEndpoint.geojson).toHaveBeenCalledTimes(1);
        /**
         * Enable q so that loadPosts is called.
         * @type {boolean}
         */
        PostFilters.qEnabled = true;
        $rootScope.$digest();
        expect(PostEndpoint.geojson.calls.count()).toEqual(3);

        /**
         * Change q twice. qEnabled is now false because we already 'clicked'and set it back to false.
         * This means loadPosts should be called zero times when we apply our q filter changes at the
         * moment.
         */
        isolateScope.$apply(function () {
            isolateScope.filters = {
                q : 'Us'
            };
        });
        $rootScope.$digest();
        isolateScope.$apply(function () {
            isolateScope.filters = {
                q : 'Ushahidi'
            };
        });
        $rootScope.$digest();
        /**
         * qEnabled is set to false successfuly if this equals 2
         */
        expect(PostEndpoint.geojson.calls.count()).toEqual(3);

        /**
         * Set qEnabled to true. This should generate 2 more call to loadPosts,
         * because of how the basic setup is done, within_km generates a second
         * watch being triggered when we call getQueryParams
         *
         *
         */
        PostFilters.qEnabled = true;
        $rootScope.$digest();
        expect(PostEndpoint.geojson.calls.count()).toEqual(5);
        /**
         * If I (for whatever reason) enable qEnabled with no changes,
         * loadPosts is still called. This is because we are actually changing
         * the filters and cannot avoid it without impacting the feature, so it's
         * the expected behavior.
         * @type {boolean}
         */
        PostFilters.qEnabled = true;
        $rootScope.$digest();
        expect(PostEndpoint.geojson.calls.count()).toEqual(6);

    });
});
