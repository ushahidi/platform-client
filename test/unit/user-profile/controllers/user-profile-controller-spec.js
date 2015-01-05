var ROOT_PATH = '../../../../';

describe('user profile controller', function(){

    var $rootScope,
        $scope,
        $controller,
        mockUserEndpoint,
        mockNotify,
        mockUserGetResponse;

    beforeEach(function(){
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .config(require(ROOT_PATH + 'app/locale-config.js'))
        .controller('userProfileController', require(ROOT_PATH + 'app/user-profile/controllers/user-profile-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function(_$rootScope_, _$controller_){
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(inject(function($q){

        mockNotify = {
            showAlerts: function(/*alerts*/) {}
        };

        mockUserGetResponse = {
            'id': 2,
            'url': 'http://ushahidi-backend/api/v2/users/2',
            'email': 'admin@22dsad.com',
            'realname': 'dasda',
            'username': 'admin',
            'role': 'admin'
        };

        var getDeferred = $q.defer();
        mockUserEndpoint = {
            get: function() {
                return {$promise: getDeferred.promise};
            }
        };

        spyOn(mockUserEndpoint, 'get').and.callThrough();

        $controller('userProfileController', {
            $scope: $scope,
            Notify: mockNotify,
            UserEndpoint: mockUserEndpoint
        });

        getDeferred.resolve(mockUserGetResponse);
        $rootScope.$digest();
    }));

    it('should have the right title', function(){
		expect($scope.title).toBe('Edit profile');
    });

    describe('UserEndpoint usage', function(){

        it('should call "get" on the UserEndpoint', function(){
            expect(mockUserEndpoint.get).toHaveBeenCalled();
        });

        it('should set the response from UserEndpoint.query() to userData and userProfileDataForEdit', function(){
            expect($scope.userProfileData).toEqual(mockUserGetResponse);
            expect($scope.userProfileDataForEdit).toEqual(mockUserGetResponse);
        });

    });

    describe('onUserProfileEditFormShow', function(){

        describe('before calling the method', function(){

            describe('userProfileDataForEdit', function(){

                it('should be defined', function(){
                    expect($scope.userProfileDataForEdit).toBeDefined();
                });

                it('should be identical to userProfileData', function(){
                    expect($scope.userProfileDataForEdit).toBe($scope.userProfileData);
                });

            });

        });

        describe('after calling the method', function(){

            beforeEach(function(){
                $scope.onUserProfileEditFormShow();
            });

            describe('userProfileDataForEdit (copy of userProfileData)', function(){

                it('should be defined', function(){
                    expect($scope.userProfileDataForEdit).toBeDefined();
                });

                it('should not be identical to userProfileData', function(){
                    expect($scope.userProfileDataForEdit).not.toBe($scope.userProfileData);
                });

                it('should be equal to userProfileData', function(){
                    expect($scope.userProfileDataForEdit).toEqual($scope.userProfileData);
                });

            });

        });

    });

    describe('saveUserProfile', function(){
        beforeEach(function(){
            $scope.userProfileDataForEdit = angular.copy($scope.userProfileData);
        });

        describe('with a successfull backend call', function(){
            beforeEach(inject(function($q){
                var updateDeferred = $q.defer();
                mockUserEndpoint.update = function(params, data) {
                    var dataToReturn = angular.extend({}, data, {someField: 'addedByServer'});
                    updateDeferred.resolve(dataToReturn);
                    return {
                        $promise: updateDeferred.promise
                    };
                };
                spyOn(mockUserEndpoint, 'update').and.callThrough();

            }));

            describe('after changed values of userProfileDataForEdit', function(){
                beforeEach(function(){
                    $scope.userProfileDataForEdit.realname = 'Changed name';
                });

                describe('after calling saveUserProfile', function(){
                    beforeEach(function(){
                        $scope.saveUserProfile();
                    });

                    it('should call "update" on the UserEndpoint with id=me and the changed user profile values', function(){
                        expect(mockUserEndpoint.update).toHaveBeenCalled();

                        var updateArgs = mockUserEndpoint.update.calls.mostRecent().args,
                        userIdParam = updateArgs[0].id,
                        requestData = updateArgs[1];

                        expect(userIdParam).toBe('me');
                        expect(requestData).toBe($scope.userProfileDataForEdit);
                    });

                    describe('after updating (digest) the scope', function(){
                        beforeEach(function(){
                            $rootScope.$digest();
                        });
                        it('should set userProfileData and userProfileDataForEdit to the new userData', function(){
                            expect($scope.userProfileDataForEdit.someField).toBe('addedByServer');
                            expect($scope.userProfileData.someField).toBe('addedByServer');
                        });
                    });

                });
            });
        });

        describe('with an error on the backend call', function(){
            beforeEach(inject(function($q){
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

                mockUserEndpoint.update = function(/*params, data*/) {
                    updateDeferred.reject(errorResponse);
                    return {
                        $promise: updateDeferred.promise
                    };
                };
                spyOn(mockUserEndpoint, 'update').and.callThrough();
                spyOn(mockNotify, 'showAlerts').and.callThrough();

            }));

            describe('change values of userProfileDataForEdit', function(){
                beforeEach(function(){
                    $scope.userProfileDataForEdit.realname = 'Changed name';
                });

                describe('after calling the method', function(){
                    beforeEach(function(){
                        $scope.saveUserProfile();
                    });

                    describe('after updating (digest) the scope', function(){
                        beforeEach(function(){
                            $rootScope.$digest();
                        });
                        it('should call Notify.showAlerts with the server errors', function(){
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
