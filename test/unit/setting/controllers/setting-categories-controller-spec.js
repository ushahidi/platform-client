var ROOT_PATH = '../../../../';

describe('setting categories controller', function () {

    var $rootScope,
        $scope,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'pascalprecht.translate',
        'ushahidi.mock'
        ]);

        testApp.controller('settingCategoriesController', require(ROOT_PATH + 'app/setting/controllers/setting-categories-controller.js'))
        .service('RoleHelper', require(ROOT_PATH + 'app/common/services/role-helper.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));


    beforeEach(function () {
       var mockTagEndpoint = {
            query: function () {
                return [{
                    name: 'test tag',
                    id: 1
                }];
            },
            delete: function () {
                return {$promise: {
                    then: function (successCallback) {
                        successCallback();
                    }
                }};
            }
        };

        var mockTranslate = function (value) {
            return {then: function (successCallback){ successCallback();}};
        };


        $controller('settingCategoriesController', {
           $scope: $scope,
           $translate: mockTranslate,
           TagEndpoint: mockTagEndpoint
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve the categories', function () {
        expect($scope.tags.length).toEqual(1);
    });

    it('should toggle selected categories', function () {
        $scope.toggleTag({id:1});
        expect($scope.selectedTags.indexOf(1)).not.toBeLessThan(0);

        $scope.toggleTag({id:1});
        expect($scope.selectedTags.indexOf(1)).toBeLessThan(0);
    });

    it('should delete tags upon request', function () {
        $scope.toggleTag({id:1});
        $scope.deleteTags();

    });

});
