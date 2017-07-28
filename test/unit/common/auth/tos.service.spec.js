describe('TermsOfService', function () {

    var TermsOfService, $rootScope, TOS_RELEASE_DATE, TermsOfServiceEndpoint, data, $httpBackend, BACKEND_URL;

    beforeEach(function () {
        makeTestApp()

        // .service('TermsOfServiceEndpoint', () => {
        //     return {
        //         get: () => {
        //             return {
        //                 $promise: Promise.resolve(data)
        //             }
        //         }
        //     };
        // })

        .service('TermsOfService', require('app/common/auth/tos.service.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _TermsOfService_, _CONST_, _TermsOfServiceEndpoint_, _$httpBackend_) {
        $rootScope = _$rootScope_;
        TermsOfService = _TermsOfService_;
        TOS_RELEASE_DATE = _CONST_.TOS_RELEASE_DATE;
        TermsOfServiceEndpoint = _TermsOfServiceEndpoint_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;

    }));

        describe('new user', function (){
            var mockTosEntryData;
            
            beforeEach(function () {
                mockTosEntryData = {results: []};
                data = mockTosEntryData;
            });
            
            it('should call the ToS authentication event when the result is empty (the user has not ever agreed to ToS)', function () {
                var successCallback = jasmine.createSpy('success');

                $httpBackend.expectGET(BACKEND_URL + '/api/v3/tos').respond(data);
                TermsOfService.getTosEntry().then(successCallback);

                // $httpBackend.flush();
                $rootScope.$digest();
                
                expect(successCallback).toHaveBeenCalled();

                
            });  
        });

    

    // it('should call the ToS authentication event when the agreement date is less than (before) the version date', function () {
    //     spyOn($rootScope, '$broadcast').and.callThrough();
    //     var invalidTosAgreementDate = (TOS_RELEASE_DATE - 1);
    //     TermsOfService.tosCheck({results: [{'agreement_date': invalidTosAgreementDate}]});
    //     expect($rootScope.$broadcast).toHaveBeenCalled();
    //     var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
    //     expect(broadcastArguments[0]).toEqual('event:authentication:tos:agreement');
    // });

    // it('should NOT call the ToS authentication event when the agreement date is greater than (after) the version date', function () {
    //     spyOn($rootScope, '$broadcast').and.callThrough();
    //     var validTosAgreementDate = (TOS_RELEASE_DATE + 1);
    //     TermsOfService.tosCheck({results: [{'agreement_date': validTosAgreementDate}]});
    //     expect($rootScope.$broadcast).not.toHaveBeenCalled();
    // });
});
