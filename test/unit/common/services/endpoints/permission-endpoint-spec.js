var rootPath = '../../../../../';

describe('PermissionEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        PermissionEndpoint;


    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ngResource',
        'angular-cache'
        ])
        .service('PermissionEndpoint', require(rootPath + 'app/common/services/endpoints/permission.js'))
        .config(require(rootPath + 'app/common/configs/cache-config.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _CONST_, _PermissionEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        PermissionEndpoint = _PermissionEndpoint_;
    }));

    describe('"permissions/:id" for data of all permissions', function () {
        describe('get all permissions', function () {

            var mockPermissionsDataResponse;

            beforeEach(function () {
                mockPermissionsDataResponse =
                {
                    'count': 2,
                    'results':
                    [
                        {
                            'id': 1,
                            'url': 'http://ushahidi-backend/api/v3/permissions/1',
                            'permission': 'admin'
                        },
                        {
                            'id': 2,
                            'url': 'http://ushahidi-backend/api/v3/permissions/2',
                            'permission': 'member'
                        }
                    ]
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v3/permissions').respond(mockPermissionDataResponse);

                PermissionEndpoint.queryFresh().$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualPermissionData = successCallback.calls.mostRecent().args[0];
                expect(actualPermissionData.results.length).toEqual(mockPermissionDataResponse.results.length);
                expect(actualPermissionData.results[0].email).toEqual(mockPermissionDataResponse.results[0].email);
            });
        });
    });

    describe('"permissions/1" for specific permission', function () {

        var mockPermissionDataResponse;

        beforeEach(function () {
            mockPermissionDataResponse = {
                'id': 1,
                'url': 'http://ushahidi-backend/api/v3/permissions/1',
                'permission': 'admin'
            };
        });

        describe('get permission data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v3/permissions/1').respond(mockPermissionDataResponse);

                PermissionEndpoint.get({id: '1'}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualPermissionData = successCallback.calls.mostRecent().args[0];
                expect(actualPermissionData.id).toEqual(mockPermissionDataResponse.id);
                expect(actualPermissionData.realname).toEqual(mockPermissionDataResponse.realname);
                expect(actualPermissionData.email).toEqual(mockPermissionDataResponse.email);
            });
        });

        describe('update permission data', function () {

            beforeEach(function () {
                mockPermissionDataResponse = {
                    'id': 2,
                    'url': 'http://ushahidi-backend/api/v3/permissions/2',
                    'permission': 'new'
                };
            });

            it('should call the correct url and return the updated permission data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v3/permissions/2').respond(mockPermissionDataResponse);

                var permissionDataToUpdate = {
                    'permission': 'new'
                };

                PermissionEndpoint.update({id: '2'}, permissionDataToUpdate).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualPermissionData = successCallback.calls.mostRecent().args[0];
                expect(actualPermissionData.id).toEqual(mockPermissionDataResponse.id);
                expect(actualPermissionData.realname).toEqual(permissionDataToUpdate.realname);
                expect(actualPermissionData.email).toEqual(permissionDataToUpdate.email);
            });
        });

    });

});
