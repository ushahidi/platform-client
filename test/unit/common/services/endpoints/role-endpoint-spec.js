var rootPath = '../../../../../';

describe('RoleEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        RoleEndpoint;


    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ngResource',
        'angular-cache'
        ])
        .service('RoleEndpoint', require(rootPath + 'app/common/services/endpoints/role.js'))
        .config(require(rootPath + 'app/common/configs/cache-config.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _CONST_, _RoleEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        RoleEndpoint = _RoleEndpoint_;
    }));

    describe('"roles/:id" for data of all roles', function () {
        describe('get all roles', function () {

            var mockRolesDataResponse;

            beforeEach(function () {
                mockRolesDataResponse =
                {
                    'count': 2,
                    'results':
                    [
                        {
                            'id': 1,
                            'url': 'http://ushahidi-backend/api/v3/roles/1',
                            'role': 'admin'
                        },
                        {
                            'id': 2,
                            'url': 'http://ushahidi-backend/api/v3/roles/2',
                            'role': 'member'
                        }
                    ]
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v3/roles').respond(mockRoleDataResponse);

                RoleEndpoint.queryFresh().$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualRoleData = successCallback.calls.mostRecent().args[0];
                expect(actualRoleData.results.length).toEqual(mockRoleDataResponse.results.length);
                expect(actualRoleData.results[0].email).toEqual(mockRoleDataResponse.results[0].email);
            });
        });
    });

    describe('"roles/1" for specific role', function () {

        var mockRoleDataResponse;

        beforeEach(function () {
            mockRoleDataResponse = {
                'id': 1,
                'url': 'http://ushahidi-backend/api/v3/roles/1',
                'role': 'admin'
            };
        });

        describe('get role data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v3/roles/1').respond(mockRoleDataResponse);

                RoleEndpoint.get({id: '1'}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualRoleData = successCallback.calls.mostRecent().args[0];
                expect(actualRoleData.id).toEqual(mockRoleDataResponse.id);
                expect(actualRoleData.realname).toEqual(mockRoleDataResponse.realname);
                expect(actualRoleData.email).toEqual(mockRoleDataResponse.email);
            });
        });

        describe('update role data', function () {

            beforeEach(function () {
                mockRoleDataResponse = {
                    'id': 2,
                    'url': 'http://ushahidi-backend/api/v3/roles/2',
                    'role': 'new'
                };
            });

            it('should call the correct url and return the updated role data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v3/roles/2').respond(mockRoleDataResponse);

                var roleDataToUpdate = {
                    'role': 'new'
                };

                RoleEndpoint.update({id: '2'}, roleDataToUpdate).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualRoleData = successCallback.calls.mostRecent().args[0];
                expect(actualRoleData.id).toEqual(mockRoleDataResponse.id);
                expect(actualRoleData.realname).toEqual(roleDataToUpdate.realname);
                expect(actualRoleData.email).toEqual(roleDataToUpdate.email);
            });
        });

    });

});
