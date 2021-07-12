describe('TermsOfService', function () {

    var TermsOfService,
        $rootScope,
        Notify,
        TermsOfServiceEndpoint,
        data;

    beforeEach(function () {
        makeTestApp()
        .value('dayjs', require('dayjs'))

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

    beforeEach(angular.mock.inject(function (_$rootScope_, _TermsOfService_, _Notify_, _TermsOfServiceEndpoint_) {
        $rootScope = _$rootScope_;
        TermsOfService = _TermsOfService_;
        Notify = _Notify_;
        TermsOfServiceEndpoint = _TermsOfServiceEndpoint_;
    }));

    it('should open the tos modal (call Notify.confirmTos) when the api result is empty (the user has not ever agreed to ToS)', function () {
        data = {results: []};

        spyOn(Notify, 'confirmTos').and.callThrough();
        spyOn(TermsOfServiceEndpoint, 'get').and.callThrough();

        TermsOfService.getTosEntry();

        expect(TermsOfServiceEndpoint.get).toHaveBeenCalled();
        expect(Notify.confirmTos).toHaveBeenCalled();

        $rootScope.$digest();
    });

    it('should open the tos modal (call Notify.confirmTos) when the agreement date is less than (before) the version date', function () {
        var inValidTosAgreementDate = '2017-07-20T22:03:27.000Z';
        data = {results: [{'agreement_date': inValidTosAgreementDate}]};
        spyOn(Notify, 'confirmTos').and.callThrough();
        spyOn(TermsOfServiceEndpoint, 'get').and.callThrough();

        TermsOfService.getTosEntry();

        expect(TermsOfServiceEndpoint.get).toHaveBeenCalled();
        expect(Notify.confirmTos).toHaveBeenCalled();

        $rootScope.$digest();
    });

    it('should NOT open the tos modal (not call Notify.confirmTos) when the agreement date is greater than (after) the version date', function () {
        var ValidTosAgreementDate = '2020-09-21T11:36:47.000Z';
        data = {results: [{'agreement_date': ValidTosAgreementDate}]};

        spyOn(Notify, 'confirmTos').and.callThrough();
        spyOn(TermsOfServiceEndpoint, 'get').and.callThrough();

        TermsOfService.getTosEntry();

        expect(TermsOfServiceEndpoint.get).toHaveBeenCalled();
        expect(Notify.confirmTos).not.toHaveBeenCalled();

        $rootScope.$digest();
    });
});
