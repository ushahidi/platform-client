var rootPath = '../../../../';

describe('Features', function () {

    var Features, $rootScope;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ])
        .service('Features', require(rootPath + 'app/common/services/features.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _Features_) {
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
