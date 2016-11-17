require('angular-resource');
require('angular-cache');


describe('PermissionEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        PermissionEndpoint;


    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.requires.push('ngResource', 'angular-cache');
        testApp
        .service('PermissionEndpoint', require('app/common/services/endpoints/permission.js'))
        .config(require('app/common/configs/cache-config.js'));



        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _CONST_, _PermissionEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        PermissionEndpoint = _PermissionEndpoint_;
    }));

    describe('"permissions/:id" for data of all permissions', function () {
        describe('get all permissions', function () {

            var mockPermissionDataResponse;

            beforeEach(function () {
                mockPermissionDataResponse =
                {
                    'count': 2,
                    'results': [
                        {
                            'id': 1,
                            'url': 'http://192.168.33.110/api/v3/permissions/1',
                            'description': null,
                            'name': 'test permission',
                            'display_name': 'Test permission',
                            'created': '1970-01-01T00:00:00+00:00',
                            'permission': null,
                            'allowed_privileges': [
                                'read',
                                'search'
                            ]
                        },
                        {
                            'id': 2,
                            'url': 'http://192.168.33.110/api/v3/permissions/2',
                            'description': 'test desc',
                            'name': 'test permission',
                            'display_name': 'Test permission',
                            'created': '1970-01-01T00:00:00+00:00',
                            'allowed_privileges': [
                                'read',
                                'search'
                            ]
                        }
                    ],
                    'limit': null,
                    'offset': 0,
                    'order': 'asc',
                    'orderby': 'id',
                    'curr': 'http://192.168.33.110/api/v3/permissions?orderby=id&order=asc&offset=0',
                    'next': 'http://192.168.33.110/api/v3/permissions?orderby=id&order=asc&offset=0',
                    'prev': 'http://192.168.33.110/api/v3/permissions?orderby=id&order=asc&offset=0',
                    'total_count': 2
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/permissions').respond(mockPermissionDataResponse);

                PermissionEndpoint.queryFresh().$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualPermissionData = successCallback.calls.mostRecent().args[0].results;
                expect(actualPermissionData.length).toEqual(mockPermissionDataResponse.results.length);
                expect(actualPermissionData[0].name).toEqual(mockPermissionDataResponse.results[0].name);
            });

            it('using queryFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(PermissionEndpoint, 'query').and.callThrough();

                PermissionEndpoint.queryFresh().$promise.then(successCallback);

                expect(PermissionEndpoint.query).toHaveBeenCalled();
            });

        });
    });

    describe('get data for "permissions/1"', function () {

        var mockPermissionDataResponse;

        beforeEach(function () {
            mockPermissionDataResponse = {
                'id': 1,
                'url': 'http://192.168.33.110/api/v3/permissions/1',
                'name': 'test permission',
                'display_name': ' Test permission',
                'description': null,
                'created': '1970-01-01T00:00:00+00:00',
                'allowed_privileges': [
                    'read',
                    'search'
                ]
            };
        });

        describe('get permission data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/permissions/1').respond(mockPermissionDataResponse);

                PermissionEndpoint.get({id: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualPermissionData = successCallback.calls.mostRecent().args[0];
                expect(actualPermissionData.id).toEqual(mockPermissionDataResponse.id);
                expect(actualPermissionData.display_name).toEqual(mockPermissionDataResponse.display_name);
                expect(actualPermissionData.name).toEqual(mockPermissionDataResponse.name);
            });

            it('using getFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(PermissionEndpoint, 'get').and.callThrough();

                PermissionEndpoint.getFresh({id: 1}).$promise.then(successCallback);
                expect(PermissionEndpoint.get).toHaveBeenCalled();
            });

        });
    });
});
