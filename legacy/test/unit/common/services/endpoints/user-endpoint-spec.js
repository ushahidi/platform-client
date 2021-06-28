require('angular-resource');
require('angular-cache');

describe('UserEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        UserEndpoint;


    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.requires.push('ngResource', 'angular-cache');
        testApp
        .service('UserEndpoint', require('app/common/services/endpoints/user-endpoint.js'))
        .config(require('app/common/configs/cache-config.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _CONST_, _UserEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        UserEndpoint = _UserEndpoint_;
    }));

    describe('"users/:id" for data of all users', function () {
        describe('get all users', function () {

            var mockUserDataResponse;

            beforeEach(function () {
                mockUserDataResponse =
                {
                    'count': 2,
                    'results':
                    [
                        {
                            'id': 1,
                            'url': 'http://ushahidi-backend/api/v2/users/1',
                            'email': 'robbie@ushahidi.com',
                            'realname': 'Robbie Mackay'
                        },
                        {
                            'id': 2,
                            'url': 'http://ushahidi-backend/api/v2/users/2',
                            'email': 'admin@22dsad.com',
                            'realname': 'Admin'
                        }
                    ]
                };
            });

            it('should call the correct url and parse and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/users').respond(mockUserDataResponse);

                UserEndpoint.queryFresh().$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualUserData = successCallback.calls.mostRecent().args[0];
                expect(actualUserData.results.length).toEqual(mockUserDataResponse.results.length);
                expect(actualUserData.results[0].email).toEqual(mockUserDataResponse.results[0].email);
            });
        });
    });

    describe('"users/me" for the user data of logged in user', function () {

        var mockUserDataResponse;

        beforeEach(function () {
            mockUserDataResponse = {
                'id': 2,
                'url': 'http://ushahidi-backend/api/v2/users/2',
                'email': 'admin@example.com',
                'realname': 'Admin Joe'
            };
        });

        describe('get user data', function () {
            it('should call the correct url and return the correct data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectGET(BACKEND_URL + '/api/v2/users/me').respond(mockUserDataResponse);

                UserEndpoint.get({id: 'me'}).$promise.then(successCallback);

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualUserData = successCallback.calls.mostRecent().args[0];
                expect(actualUserData.id).toEqual(mockUserDataResponse.id);
                expect(actualUserData.realname).toEqual(mockUserDataResponse.realname);
                expect(actualUserData.email).toEqual(mockUserDataResponse.email);
            });
        });

        describe('update user data', function () {

            beforeEach(function () {
                mockUserDataResponse = {
                    'id': 2,
                    'url': 'http://ushahidi-backend/api/v2/users/2',
                    'email': 'new@email.com',
                    'realname': 'Obi Wan'
                };
            });

            it('should call the correct url and return the updated user data', function () {
                var successCallback = jasmine.createSpy('success');
                $httpBackend.expectPUT(BACKEND_URL + '/api/v2/users/me').respond(mockUserDataResponse);

                var userDataToUpdate = {
                    'email': 'new@email.com',
                    'realname': 'Obi Wan'
                };

                UserEndpoint.update({id: 'me'}, userDataToUpdate).$promise.then(successCallback);
                // var promise = UserEndpoint.update({id: 'me'}, $scope.userProfileDataForEdit).$promise;

                $httpBackend.flush();
                $rootScope.$digest();

                expect(successCallback).toHaveBeenCalled();

                var actualUserData = successCallback.calls.mostRecent().args[0];
                expect(actualUserData.id).toEqual(mockUserDataResponse.id);
                expect(actualUserData.realname).toEqual(userDataToUpdate.realname);
                expect(actualUserData.email).toEqual(userDataToUpdate.email);
            });
        });

    });

});
