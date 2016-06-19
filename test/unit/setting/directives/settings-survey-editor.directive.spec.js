var ROOT_PATH = '../../../../';

describe('setting survey editor directive', function () {

    var $rootScope,
        $scope,
        $location,
        $compile,
        Notify,
        element,
        mockFormEndpoint,
        mockFeatures;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('surveyEditor', require(ROOT_PATH + 'app/setting/directives/setting-survey-editor.directive'))
        .service('FormEndpoint', function () {
            return mockFormEndpoint;
        })
        .service('Features', function () {
            return mockFeatures;
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, _$compile_, _Notify_, _$location_, $q) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;

        Notify = _Notify_;
        $location = _$location_;

        spyOn($location, 'path');
        spyOn(Notify, 'limit');

        mockFormEndpoint = {
            query : function () {
                return {
                    '$promise': $q.resolve([
                        { id: 1 },
                        { id: 2 },
                        { id: 3 }
                    ])
                };
            }
        };

        mockFeatures = {
            limit: 2,
            loadFeatures : function () {
                return $q.resolve();
            },
            getLimit : function () {
                return this.limit;
            }
        };
    }));

    function compile() {
        element = '<survey-editor></survey-editor>';
        element = $compile(element)($scope);
        $scope.$digest();
    }

    it('should redirect if over survey limit', function () {
        mockFeatures.limit = 3;

        compile();

        expect(Notify.limit).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalled();
    });

    it('should not redirect if under survey limit', function () {
        mockFeatures.limit = 5;

        compile();

        expect(Notify.limit).not.toHaveBeenCalled();
        expect($location.path).not.toHaveBeenCalled();
    });

    it('should not redirect if NO survey limit', function () {
        mockFeatures.limit = true;

        compile();
        expect(Notify.limit).not.toHaveBeenCalled();
        expect($location.path).not.toHaveBeenCalled();
    });

});
