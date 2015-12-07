var ROOT_PATH = '../../../../';

describe('Collection Selector directive', function () {
    var $scope,
       $compile,
       CollectionEndpoint;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'pascalprecht.translate',
            'ngResource',
            'angular-cache'
        ])
        .directive('collectionSelector', require(ROOT_PATH + 'app/common/directives/collection-selector.js'))
        .service('CollectionEndpoint', require(ROOT_PATH + 'app/set/services/endpoints/collection.js'))
        .service('Notify', require(ROOT_PATH + 'app/common/services/notify.js'))

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_,
                                _$compile_,
                                _CollectionEndpoint_
                               ) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        PostEndpoint = _PostEndpoint_;

        directiveElem = getCompiledElement();
    }));

    getCompiledElement = function () {
        var compiledDirective = compile(
            angular.element(
                '<collection-selector post="post"></collection-selector>'
            ))($scope);
        $scope.$digest();
        return compiledDirective;
    };
});

