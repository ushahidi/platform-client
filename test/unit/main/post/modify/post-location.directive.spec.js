var ROOT_PATH = '../../../../../';

describe('post location directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element,
        Geocoding;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postLocation', require('app/main/posts/modify/post-location.directive'));

        angular.mock.module('testApp');
    });



    beforeEach(function () {
        angular.mock.module(function ($provide) {

            $provide.value('Geocoding', {
                search: function (searchLocationTerm) {}
            });

            $provide.value('leafletData', {
                getMap: function (mapName) {
                    return {
                        then: function (callback) {
                            return angular.element();
                        }
                    };
                }
            });

            $provide.value('Leaflet', {
                control: {
                    locate: function (opts) {
                        return {
                            addTo: function (m) {}
                        };
                    }
                }
            });
        });
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_, _Geocoding_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        Geocoding = _Geocoding_;

        $scope.post = {};
        $scope.model = {};
        element = '<post-location attribute="attribute" key="key" model="model"></post-location>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();

    }));

    describe('test directive functions', function () {
        it('should not clear search location term for failed searches', function () {
            isolateScope.$apply(function () {
                isolateScope.searchLocationTerm = 'Lorem';
            });

            spyOn(Geocoding, 'search').and.callFake(function (kupi) {
                return {
                    then: function (callback) {
                        callback(false);
                    }
                };
            });

            isolateScope.searchLocation();
            expect(isolateScope.searchLocationTerm).toEqual('Lorem');
        });

        it('should clear search location term for successful searches', function () {

            isolateScope.$apply(function () {
                isolateScope.searchLocationTerm = 'Ipsum';
            });

            spyOn(Geocoding, 'search').and.callFake(function (kupi) {
                return {
                    then: function (callback) {
                        callback([1,2]);
                    }
                };
            });

            isolateScope.searchLocation();
            expect(isolateScope.searchLocationTerm).toEqual('');
        });

        it('should call updateLatLon, updateMarkerPosition and centerMapTo on successful search', function () {
            spyOn(isolateScope, 'updateLatLon');
            spyOn(isolateScope, 'updateMarkerPosition');
            spyOn(isolateScope, 'centerMapTo');

            spyOn(Geocoding, 'search').and.callFake(function (kupi) {
                return {
                    then: function (callback) {
                        callback([1, 2]);
                    }
                };
            });

            isolateScope.searchLocation();

            expect(isolateScope.updateLatLon).toHaveBeenCalledWith(1, 2);
            expect(isolateScope.updateMarkerPosition).toHaveBeenCalledWith(1, 2);
            expect(isolateScope.centerMapTo).toHaveBeenCalledWith(1, 2);
        });

        it('should clear scope model, center and markers when Clear button is pressed', function () {

            isolateScope.$apply(function () {
                isolateScope.model = { lat: 100, lng: 200 };
                isolateScope.initialCenter = { lat: 100, lng: 200 };
                isolateScope.center = { lat: 20, lng: 30 };

                isolateScope.markers = {
                    m1 : { lat: 40, lng: 50 }
                };
            });

            isolateScope.clear();

            expect(isolateScope.model).toBeNull();
            expect(isolateScope.center).toEqual(isolateScope.initialCenter);
            expect(isolateScope.markers).toEqual({});
        });
    });

});
