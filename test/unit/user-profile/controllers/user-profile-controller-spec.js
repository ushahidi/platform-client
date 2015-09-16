var ROOT_PATH = '../../../../';

describe('user profile controller', function () {

    var $rootScope,
        $scope,
        $controller,
        mockUserEndpoint,
        mockNotify,
        mockUserGetResponse;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'))
        .controller('userProfileController', require(ROOT_PATH + 'app/user-profile/controllers/user-profile-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(inject(function ($q) {

        mockNotify = {
            showAlerts: function (/*alerts*/) {}
        };

        mockUserGetResponse = {
            'id': 2,
            'url': 'http://ushahidi-backend/api/v2/users/2',
            'email': 'admin@22dsad.com',
            'realname': 'dasda',
            'role': 'admin'
        };

        mockUserEndpoint = {};

        $controller('userProfileController', {
            $scope: $scope,
            Notify: mockNotify,
            UserEndpoint: mockUserEndpoint,
            user: mockUserGetResponse
        });

        $rootScope.$digest();
    }));

    it('should have the right title', function () {
        expect($scope.title).toBe('Edit profile');
    });

    describe('UserEndpoint usage', function () {

        it('should set the user response', function () {
            expect($scope.user).toEqual(mockUserGetResponse);
        });

    });

    describe('saveUser', function () {
        describe('with a successfull backend call', function () {
            beforeEach(inject(function ($q) {
                var updateDeferred = $q.defer();
                mockUserEndpoint.update = function (params, data) {
                    var dataToReturn = angular.extend({}, data, {someField: 'addedByServer'});
                    updateDeferred.resolve(dataToReturn);
                    return {
                        $promise: updateDeferred.promise
                    };
                };
                spyOn(mockUserEndpoint, 'update').and.callThrough();

            }));

            describe('after changed values of user', function () {
                beforeEach(function () {
                    $scope.user.realname = 'Changed name';
                });

                describe('after calling saveUser', function () {
                    beforeEach(function () {
                        $scope.saveUser($scope.user);
                    });

                    it('should call "update" on the UserEndpoint with id=me and the changed user profile values', function () {
                        expect(mockUserEndpoint.update).toHaveBeenCalled();
                        expect($scope.user.realname).toBe('Changed name');
                    });

                    describe('after updating (digest) the scope', function () {
                        beforeEach(function () {
                            $rootScope.$digest();
                        });

                        it('should set user to the new data', function () {
                            expect($scope.user.someField).toBe('addedByServer');
                        });
                    });
                });
            });
        });

        describe('with an error on the backend call', function () {
            beforeEach(inject(function ($q) {
                var updateDeferred = $q.defer(),
                errorResponse = {
                    status: 400,
                    data: {
                        'errors': [
                            {
                                'message': 'invalid email address'
                            }
                        ]
                    }
                };

                mockUserEndpoint.update = function (/*params, data*/) {
                    updateDeferred.reject(errorResponse);

                    return {
                        $promise: updateDeferred.promise
                    };
                };
                spyOn(mockUserEndpoint, 'update').and.callThrough();
                spyOn(mockNotify, 'showAlerts').and.callThrough();
            }));

            describe('change values of user', function () {
                beforeEach(function () {
                    $scope.user.email = 'Changed email';
                });

                describe('after calling the method', function () {
                    beforeEach(function () {
                        $scope.saveUser($scope.user);
                    });

                    describe('after updating the scope', function () {
                        beforeEach(function () {
                            $rootScope.$digest();
                        });

                        it('should call Notify.showAlerts with the server errors', function () {
                            expect(mockNotify.showAlerts).toHaveBeenCalled();
                            var alertMessages = mockNotify.showAlerts.calls.mostRecent().args[0];
                            expect(alertMessages).toEqual(['invalid email address']);
                        });
                    });
                });
            });
        });
    });
});
