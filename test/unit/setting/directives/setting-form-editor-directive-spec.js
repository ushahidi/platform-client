var ROOT_PATH = '../../../../';

describe('setting form editor directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('formEditor', require(ROOT_PATH + 'app/setting/directives/setting-form-editor-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        element = '<div form-editor></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should set the visible stage', function () {
        $scope.setVisibleStage(1);

        expect($scope.visibleStage).toEqual(1);
    });

    it('should save form setting', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.saveFormSettings({id: 'pass'});

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should fail to save form settings', function () {
        spyOn(Notify, 'showApiErrors');

        $scope.saveFormSettings({id: 'fail'});

        expect(Notify.showApiErrors).toHaveBeenCalled();
    });

    it('should delete the given form', function () {
        spyOn(Notify, 'showNotificationSlider');
        $scope.form.id = 'pass';
        $scope.deleteForm(1);

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should delete the given stage', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.deleteStage({id: 1}, 1);

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should change priority of a given stage', function () {
        $scope.form.id = 1;

        $scope.changePriority($scope.form.stages[0], 1);
        expect($scope.form.stages[0].id).toEqual(2);
    });

    it('should open a new stage modal', function () {
        $scope.openNewStage();
        expect($scope.isNewStageOpen).toBe(true);
    });

    it('should save a new stage', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.saveNewStage({name: 'new test stage'});

        expect($scope.isNewStageOpen).toBe(false);
        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should open a new attribute modal', function () {
        $scope.openNewAttribute();
        expect($scope.isNewAttributeOpen).toBe(true);
    });

    it('should add a new attribute', function () {
        $scope.addNewAttribute({label: 'checkbox'});

        expect($scope.editIsOpen[2]).toBe(true);
    });

    it('should save a attribute stage', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.saveAttribute({label: 'new test attribute'}, 1);

        expect($scope.isNewAttributeOpen).toBe(false);
        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should delete an existing attribute', function () {
        spyOn(Notify, 'showNotificationSlider');
        $scope.deleteAttribute({id: 1});

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should delete an unsaved attribute', function () {
        $scope.addNewAttribute({label: 'test new'});
        $scope.deleteAttribute({label: 'test new'});

        expect($scope.form.attributes.length).toEqual(2);
    });

    it('should change priority of a given attribute', function () {
        $scope.form.id = 1;

        $scope.changeAttributePriority($scope.form.attributes[0], 1);
        expect($scope.form.attributes[0].id).toEqual(2);
    });

});
