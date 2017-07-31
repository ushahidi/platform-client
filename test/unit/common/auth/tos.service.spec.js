describe('TermsOfService', function () {

    var TermsOfService,
        $rootScope,
        TOS_RELEASE_DATE,
        Notify,
        $q,
        $scope,
        TermsOfServiceEndpoint,
        BACKEND_URL;

    beforeEach(function () {
        makeTestApp()

        .service('TermsOfService', require('app/common/auth/tos.service.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$q_, _$rootScope_, _TermsOfService_, _CONST_, _Notify_, _TermsOfServiceEndpoint_) {
        $rootScope = _$rootScope_;
        TermsOfService = _TermsOfService_;
        TOS_RELEASE_DATE = _CONST_.TOS_RELEASE_DATE;
        Notify = _Notify_;
        TermsOfServiceEndpoint = _TermsOfServiceEndpoint_;
        $q = _$q_;
        $scope = _$rootScope_.$new();
        BACKEND_URL = _CONST_.BACKEND_URL;
    }));

    beforeEach(function () {
        // $rootScope.$digest();
        // $rootScope.$apply();
    });

    describe('new user', function () {

        it('should call the ToS authentication event when the result is empty (the user has not ever agreed to ToS)', function () {

            spyOn(Notify, 'confirmTos').and.callThrough();
            spyOn(TermsOfServiceEndpoint, 'get').and.callThrough();

            TermsOfService.getTosEntry();

            expect(TermsOfServiceEndpoint.get).toHaveBeenCalled();
            expect(Notify.confirmTos).toHaveBeenCalled();

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
