describe('view for translating a survey', function () {

    var $rootScope,
        $scope,
        ModalService,
        element,
        isolateScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.directive('surveyTranslationEditor', require('app/settings/surveys/survey-translation-editor.directive.js'));
        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _ModalService_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        ModalService = _ModalService_;
        $scope.survey = {
            'id': 1,
            'enabled_languages': {'default': 'en','available' : ['es']},
            'type': 'report',
            'name':'test form',
            'description':'Testing form',
            'translations':{'es':{'name':'','description':''}}
        };
        $scope.defaultLanguage = 'en';
        $scope.activeLanguage = 'sw';
        element = '<survey-translation-editor survey="survey" default-language="defaultLanguage" active-language="activeLanguage"></survey-translation-editor>';
        element = $compile(element)($scope);
        isolateScope = element.isolateScope();
        $scope.$digest();
        $rootScope.$apply();
    }));


    it('should open attribute-translation-modal', function () {
        spyOn(ModalService, 'openTemplate');
        isolateScope.openField({id:1, translations:{}}, {id:2});
        expect(ModalService.openTemplate).toHaveBeenCalledTimes(1);
    });
});
