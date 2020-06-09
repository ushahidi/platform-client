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

        element = '<survey-translation-editor></survey-translation-editor>';
        element = $compile(element)($scope);
        isolateScope = element.isolateScope();
        $scope.$digest();
        $rootScope.$apply();
    }));


    it('should open attribute-translation-modal', function () {
        let isolateScope = element.isolateScope();
        spyOn(ModalService, 'openTemplate');
        isolateScope.openField({id:1, translations:{}}, {id:2});
        expect(ModalService.openTemplate).toHaveBeenCalledTimes(1);
    });
});
