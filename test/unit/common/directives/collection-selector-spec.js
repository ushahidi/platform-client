var rootPath = '../../../../';

describe('Collection selector', function () {

    var $rootScope,
        $scope;

    beforeEach(function () {
        var testApp = angular.module('testApp', [])
          .directive('collectionSelector', require('ROOT_PATH' + 'app/common/directives/collection-selector.js');

          require(ROOT_PATH + 'test/unit/sinple-test-app-config')(testApp);

          angular.mock.module('testApp');
    });

    beforeEach(inject(function (_rootScope_) {
        $rootScope = _$rootScope_;
    }));
});
