var rootPath = '../../../../../';

describe('authentication interceptor', function(){

    var $httpBackend,
        $rootScope,
        $httpProviderIt,
        $http,
        API_URL,
        BACKEND_URL,
        mockedSessionData;

    beforeEach(function(){
        var testApp = angular.module('testApp', [], function($httpProvider){
            $httpProviderIt = $httpProvider;
        });

        mockedSessionData = {
            accessToken: 'fooBarToken'
        };
        testApp.service('Session', function(){
            return {
                clearSessionData: function(){
                    mockedSessionData = {};
                },
                setSessionDataEntries: function(entries){
                    mockedSessionData = angular.extend({}, mockedSessionData, entries);
                },
                getSessionDataEntry: function(key){
                    return mockedSessionData[key];
                },
                setSessionDataEntry: function(key, value){
                    mockedSessionData[key] = value;
                }
            };
        })
        .config(require(rootPath+'app/common/configs/authentication-interceptor.js'));

        require(rootPath+'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function(_$httpBackend_, _$http_, _$rootScope_, _CONST_){
        $httpBackend = _$httpBackend_;
        $http = _$http_;
        $rootScope = _$rootScope_;
        API_URL = _CONST_.API_URL;
        BACKEND_URL = _CONST_.BACKEND_URL;
    }));

    describe('$httpProvider', function(){
        it('should have the authInterceptor', function () {
            expect($httpProviderIt.interceptors).toContain('authInterceptor');
        });
    });

    describe('request handler', function(){

        describe('for API requests', function () {
            it('should add the authorization token header', function () {

                $httpBackend.expectGET(API_URL+'/test-endpoint',
                    {'Accept':'application/json, text/plain, */*','Authorization':'Bearer fooBarToken'}
                ).respond(200);

                $http.get(API_URL+'/test-endpoint');

                $httpBackend.flush();
            });
        });

        describe('for non-API requests', function () {
            it('should not add the authorization token header', function () {
                $httpBackend.expectGET(BACKEND_URL+'/non-api-url',
                    {'Accept':'application/json, text/plain, */*'}
                ).respond(200);

                $http.get(BACKEND_URL+'/non-api-url');

                $httpBackend.flush();
            });
        });

    });

    describe('responseError handler', function(){

        beforeEach(function(){
            spyOn($rootScope, '$broadcast').and.callThrough();
        });

        describe('for a 401 error', function(){

            var broadcastArguments;
            beforeEach(function(){
                $httpBackend.whenGET(BACKEND_URL+'/some-url').respond(401);
                $http.get(BACKEND_URL+'/some-url');
                $httpBackend.flush();
                broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
            });

            it('should broadcast an "unauthorized" event over the rootScope', function(){
                expect($rootScope.$broadcast).toHaveBeenCalled();
                expect(broadcastArguments[0]).toEqual('event:unauthorized');
            });
        });

        describe('for a non-401 error', function(){
            beforeEach(function(){
                $httpBackend.whenGET(BACKEND_URL+'/some-url').respond(200);
                $http.get(BACKEND_URL+'/some-url');
                $httpBackend.flush();
            });

            it('should not broadcast an event over the rootScope', function(){
                expect($rootScope.$broadcast).not.toHaveBeenCalled();
            });
        });
    });
});
