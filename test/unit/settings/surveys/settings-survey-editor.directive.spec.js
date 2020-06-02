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

        var testApp = makeTestApp();

        testApp.directive('surveyEditor', require('app/settings/surveys/survey-editor.directive'))
        .service('FormEndpoint', function () {
            return mockFormEndpoint;
        })
        .service('Features', function () {
            return mockFeatures;
        });

        testApp.service('$state', function () {
            return {
                'go': function () {
                    return {};
                }
            };
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _Notify_, _$location_, $q) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        Notify = _Notify_;
        $location = _$location_;

        spyOn($location, 'path').and.callThrough();
        spyOn(Notify, 'limit').and.callThrough();

        mockFormEndpoint = {
            queryFresh : function () {
                return {
                    '$promise': $q.resolve([
                        { id: 1, children: [] },
                        { id: 2, children: []},
                        { id: 3, children: [] }
                    ])
                };
            }
        };

        mockFeatures = {
            limit: 2,
            loadFeatures : function () {
                return $q.resolve(true);
            },
            getLimit : function () {
                return this.limit;
            },
            isFeatureEnabled: function (feature) {
                return;
            }
        };
    }));

    function compile() {
        element = '<survey-editor></survey-editor>';
        element = $compile(element)($scope);
        $scope.$digest();

    }
// Activate-function
    it('should redirect if over survey limit', function () {
        mockFeatures.limit = 3;
        compile();
        setTimeout(function() {
            expect(Notify.limit).toHaveBeenCalled();
            expect($location.path).toHaveBeenCalled()
        }, 900);
    });

    it('should not redirect if under survey limit', function () {
        mockFeatures.limit = 5;

        compile();
        setTimeout(function() {
        expect(Notify.limit).not.toHaveBeenCalled();
        expect($location.path).not.toHaveBeenCalled();
        }, 900);
    });

    it('should not redirect if NO survey limit', function () {
        mockFeatures.limit = true;

        compile();
        setTimeout(function() {
            expect(Notify.limit).not.toHaveBeenCalled();
            expect($location.path).not.toHaveBeenCalled();
        }, 900);
    });
});
