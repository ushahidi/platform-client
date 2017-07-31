describe('TermsOfService', function () {

    var TermsOfService,
        $rootScope,
        TOS_RELEASE_DATE,
        Notify,
        $q,
        $scope,
        TermsOfServiceEndpoint,
        data,
        BACKEND_URL;

    beforeEach(function () {
        makeTestApp()

        .service('TermsOfServiceEndpoint', function () {
            return {
                get: function () {
                    return {$promise: {
                        then: function (successCallback, failCallback) {
                            successCallback(data);
                        }
                    }};
                }
            };
        })

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

    it('should call the ToS authentication event when the result is empty (the user has not ever agreed to ToS)', function () {
        data = {results: []};

        spyOn(Notify, 'confirmTos').and.callThrough();
        spyOn(TermsOfServiceEndpoint, 'get').and.callThrough();

        TermsOfService.getTosEntry();

        expect(TermsOfServiceEndpoint.get).toHaveBeenCalled();
        expect(Notify.confirmTos).toHaveBeenCalled();

        $rootScope.$digest();
    });

    it('should call the ToS authentication event when the agreement date is less than (before) the version date', function () {
        var inValidTosAgreementDate = (TOS_RELEASE_DATE - 1);
        data = {results: [{'agreement_date': inValidTosAgreementDate}]};

        spyOn(Notify, 'confirmTos').and.callThrough();
        spyOn(TermsOfServiceEndpoint, 'get').and.callThrough();

        TermsOfService.getTosEntry();

        expect(TermsOfServiceEndpoint.get).toHaveBeenCalled();
        expect(Notify.confirmTos).toHaveBeenCalled();

        $rootScope.$digest();
    });

    it('should NOT call the ToS authentication event when the agreement date is greater than (after) the version date', function () {
        var ValidTosAgreementDate = (TOS_RELEASE_DATE + 1);
        data = {results: [{'agreement_date': ValidTosAgreementDate}]};

        spyOn(Notify, 'confirmTos').and.callThrough();
        spyOn(TermsOfServiceEndpoint, 'get').and.callThrough();

        TermsOfService.getTosEntry();

        expect(TermsOfServiceEndpoint.get).toHaveBeenCalled();
        expect(Notify.confirmTos).not.toHaveBeenCalled();

        $rootScope.$digest();
    });
});
