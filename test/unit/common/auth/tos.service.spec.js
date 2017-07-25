describe('TermsOfService', function () {

    var TermsOfService, $rootScope, TOS_RELEASE_DATE;

    beforeEach(function () {
        makeTestApp()

        .service('TermsOfServiceEndpoint', () => {
            return {
                get: () => {
                    return {
                        $promise: {
                            then: (cb) => {
                                cb();
                            }
                        }
                    };
                }
            };
        })

        .service('TermsOfService', require('app/common/auth/tos.service.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _TermsOfService_, _CONST_) {
        $rootScope = _$rootScope_;
        TermsOfService = _TermsOfService_;
        TOS_RELEASE_DATE = _CONST_.TOS_RELEASE_DATE;
    }));

    it('should call the ToS authentication event when the result is empty (the user has not ever agreed to ToS)', function () {
        spyOn($rootScope, '$broadcast').and.callThrough();
        TermsOfService.tosCheck({results: []});
        expect($rootScope.$broadcast).toHaveBeenCalled();
        var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
        expect(broadcastArguments[0]).toEqual('event:authentication:tos:agreement');
    });

    it('should call the ToS authentication event when the agreement date is less than (before) the version date', function () {
        spyOn($rootScope, '$broadcast').and.callThrough();
        var invalidTosAgreementDate = (TOS_RELEASE_DATE - 1);
        TermsOfService.tosCheck({results: [{'agreement_date': invalidTosAgreementDate}]});
        expect($rootScope.$broadcast).toHaveBeenCalled();
        var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
        expect(broadcastArguments[0]).toEqual('event:authentication:tos:agreement');
    });

    it('should NOT call the ToS authentication event when the agreement date is greater than (after) the version date', function () {
        spyOn($rootScope, '$broadcast').and.callThrough();
        var validTosAgreementDate = (TOS_RELEASE_DATE + 1);
        TermsOfService.tosCheck({results: [{'agreement_date': validTosAgreementDate}]});
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
    });
});
