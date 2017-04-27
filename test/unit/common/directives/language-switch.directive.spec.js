describe('language-switch directive', function () {
    var $rootScope,
        $scope,
        $compile,
        element,
        isolateScope,
        Languages;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();
        testApp.directive('languageSwitch', require('app/common/directives/language-switch.directive.js'));
        angular.mock.module('testApp');

    });
    beforeEach(inject(function (_$rootScope_, _$compile_, _Languages_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        Languages = _Languages_;

        element = '<language-switch></language-switch>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        spyOn(isolateScope, 'changeLanguage').and.callThrough();
    }));
    it('should fetch all languages from language-service', function () {
        isolateScope.languages.forEach(function (object) {
            delete object.$$hashKey;
        });
        expect(isolateScope.languages).toEqual([{
                    'rtl': false,
                    'pluralequation': 'language.pluralequation',
                    'code': 'en',
                    'name': 'English',
                    'nplurals': 2
                }]);
    });
    it('should change language when using dropdown', function () {
        var change = new Event('change');
        var elementToClick = element[0].getElementsByTagName('select')[0];
        elementToClick.dispatchEvent(change);
        expect(isolateScope.changeLanguage).toHaveBeenCalled();
    });
});
