describe('Features', function () {

    var Features, $rootScope;

    beforeEach(function () {
        makeTestApp()
        .service('Features', require('app/common/services/features.js'));


        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _Features_) {
        $rootScope = _$rootScope_;
        Features = _Features_;
        Features.loadFeatures();
    }));

    it('should check if feature is enabled', function () {
        expect(Features.isFeatureEnabled('test')).toBe(true);
    });

    it('should check if a view is enabled', function () {
        expect(Features.isViewEnabled('test')).toBe(true);
    });

    it('should get a limit for a given feature', function () {
        expect(Features.getLimit('test')).toEqual(1);
    });

    it('should reload features', function () {
        Features.features = undefined;
        Features.loadFeatures();

        expect(Features.features.limits.test).toEqual(1);
    });
});
