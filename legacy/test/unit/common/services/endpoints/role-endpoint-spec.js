require('angular-resource');
require('angular-cache');


describe('RoleEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        RoleEndpoint;


    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.requires.push('ngResource', 'angular-cache');
        testApp
        .service('RoleEndpoint', require('app/common/services/endpoints/role.js'))
        .config(require('app/common/configs/cache-config.js'));



        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _CONST_, _RoleEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        RoleEndpoint = _RoleEndpoint_;
    }));

    describe('"roles/:id" for data of all roles', function () {
        describe('get all roles', function () {

            var mockRoleDataResponse;

            beforeEach(function () {
                mockRoleDataResponse =
                {
                    'count': 2,
                    'results': [
                        {
                            'id': 1,
                            'url': 'http://192.168.33.110/api/v3/roles/1',
                            'description': null,
                            'name': 'test role',
                            'permissions': ['Manage Users', 'Manage Posts'],
                            'display_name': 'Test role',
                            'created': '1970-01-01T00:00:00+00:00',
                            'role': null,
                            'allowed_privileges': [
                                'read',
                                'create',
                                'update',
                                'delete',
                                'search'
                            ]
                        },
                        {
                            'id': 2,
                            'url': 'http://192.168.33.110/api/v3/roles/2',
                            'description': 'test desc',
                            'name': 'test role',
                            'permissions': ['Manage Users', 'Manage Posts'],
                            'display_name': 'Test role',
                            'created': '1970-01-01T00:00:00+00:00',
                            'allowed_privileges': [
                                'read',
                                'create',
                                'update',
                                'delete',
                                'search'
                            ]
                        }
                    ],
                    'limit': null,
                    'offset': 0,
                    'order': 'asc',
                    'orderby': 'id',
                    'curr': 'http://192.168.33.110/api/v3/roles?orderby=id&order=asc&offset=0',
                    'next': 'http://192.168.33.110/api/v3/roles?orderby=id&order=asc&offset=0',
                    'prev': 'http://192.168.33.110/api/v3/roles?orderby=id&order=asc&offset=0',
                    'total_count': 2
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/roles').respond(mockRoleDataResponse);

                RoleEndpoint.queryFresh().$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualRoleData = successCallback.calls.mostRecent().args[0];
                expect(actualRoleData.length).toEqual(mockRoleDataResponse.results.length);
                expect(actualRoleData[0].name).toEqual(mockRoleDataResponse.results[0].name);
            });

            it('using queryFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(RoleEndpoint, 'query').and.callThrough();

                RoleEndpoint.queryFresh().$promise.then(successCallback);

                expect(RoleEndpoint.query).toHaveBeenCalled();
            });

        });
    });

    describe('get data for "roles/1"', function () {

        var mockRoleDataResponse;

        beforeEach(function () {
            mockRoleDataResponse = {
                'id': 1,
                'url': 'http://192.168.33.110/api/v3/roles/1',
                'name': 'test role',
                'display_name': ' Test role',
                'description': null,
                'permissions': ['Manage users'],
                'created': '1970-01-01T00:00:00+00:00',
                'allowed_privileges': [
                    'read',
                    'create',
                    'update',
                    'delete',
                    'search'
                ]
            };
        });

        describe('get role data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/roles/1').respond(mockRoleDataResponse);

                RoleEndpoint.get({id: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualRoleData = successCallback.calls.mostRecent().args[0];
                expect(actualRoleData.id).toEqual(mockRoleDataResponse.id);
                expect(actualRoleData.display_name).toEqual(mockRoleDataResponse.display_name);
                expect(actualRoleData.name).toEqual(mockRoleDataResponse.name);
            });

            it('using getFresh should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(RoleEndpoint, 'get').and.callThrough();

                RoleEndpoint.getFresh({id: 1}).$promise.then(successCallback);
                expect(RoleEndpoint.get).toHaveBeenCalled();
            });

        });

        describe('update role data', function () {

            beforeEach(function () {
                mockRoleDataResponse = {
                    'id': 1,
                    'url': 'http://192.168.33.110/api/v3/roles/1',
                    'name': 'Test role',
                    'display_name': ' Test role',
                    'description': 'Test',
                    'permissions': ['Manage users'],
                    'created': '1970-01-01T00:00:00+00:00',
                    'allowed_privileges': [
                        'read',
                        'create',
                        'update',
                        'delete',
                        'search'
                    ]
                };
            });

            it('should call the correct url and return the updated role data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v2/roles/1').respond(mockRoleDataResponse);

                var roleDataToUpdate = {
                    'id': 1,
                    'name': 'Test role',
                    'description': 'Test'
                };

                RoleEndpoint.update(roleDataToUpdate).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualRoleData = successCallback.calls.mostRecent().args[0];
                expect(actualRoleData.id).toEqual(mockRoleDataResponse.id);
                expect(actualRoleData.name).toEqual(roleDataToUpdate.name);
                expect(actualRoleData.description).toEqual(roleDataToUpdate.description);
            });

            it('using saveCache should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(RoleEndpoint, 'update').and.callThrough();

                RoleEndpoint.saveCache({id: 1}).$promise.then(successCallback);
                expect(RoleEndpoint.update).toHaveBeenCalled();
            });

            it('should return an id when deleting an entity', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectDELETE(BACKEND_URL + '/api/v2/roles/1').respond(mockRoleDataResponse);

                RoleEndpoint.deleteEntity({id: 1}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualRoleData = successCallback.calls.mostRecent().args[0];
                expect(actualRoleData.id).toEqual(mockRoleDataResponse.id);
            });

            it('using delete should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');

                spyOn(RoleEndpoint, 'deleteEntity').and.callThrough();

                RoleEndpoint.delete({id: 1}).$promise.then(successCallback);
                expect(RoleEndpoint.deleteEntity).toHaveBeenCalled();
            });
        });
    });
});
