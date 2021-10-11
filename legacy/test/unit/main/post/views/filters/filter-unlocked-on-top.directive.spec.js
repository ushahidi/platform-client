describe('filter unlocked on top directive', function () {

    var
        $scope,
        element,
        $rootScope,
        isolateScope,
        FilterTransformers,
        PostFilters;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();
        testApp.directive('filterUnlockedOnTop', require('app/map/post-toolbar/filters/filter-unlocked-on-top.directive'))
                .service('FilterTransformers', require('app/map/post-toolbar/filters/filter-transformers.service.js'))
                .service('PostFilters', require('app/common/services/post-filters.service.js'));
        angular.mock.module('testApp');
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _FilterTransformers_, _PostFilters_) {
        $rootScope = _$rootScope_;
        FilterTransformers = _FilterTransformers_;
        PostFilters = _PostFilters_;
        spyOn(FilterTransformers.transformers, 'order_unlocked_on_top');
        $scope = $rootScope.$new();
        $scope.filters = {
            q: '',
            date_after: '',
            date_before: '',
            status: ['published', 'draft'],
            published_to: '',
            center_point: '',
            has_location: 'all',
            within_km: '1',
            current_stage: [],
            tags: [],
            saved_search: '',
            orderby: 'created',
            order: 'desc',
            order_unlocked_on_top: 'true',
            form: [],
            set: [],
            user: false,
            source: ['sms', 'twitter','web', 'email']
        };
        // $scope.models = {};
        // $scope.models.modelUnlocked = 'true';
        element = '<filter-unlocked-on-top ng-model="filters.order_unlocked_on_top"></filter-unlocked-on-top>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
        spyOn(PostFilters, 'getUIActiveFilters').and.callThrough();
        spyOn(PostFilters, 'getFilters').and.callThrough();
    }));

    describe('test directive functions', function () {
        it('unlockedOnTop value should be true by default', function () {
            expect(isolateScope.unlockedOnTop.value).toEqual('true');
        });
        it('$scope.filters and cleanActive filters should change when unlockedOnTop changes', function () {
            isolateScope.unlockedOnTop.value = 'false';
            $rootScope.$digest();
            /**
             * Checks that order_unlocked_on_top (which we send as ngModel) was updated on setViewValue
             * this is pretty much all this directive does.
             */
            expect($scope.filters.order_unlocked_on_top).toEqual('false');
            /**
             * Checks that no other filters changed because of changing order_unlocked_on_top
             */
            expect(PostFilters.getUIActiveFilters($scope.filters)).toEqual({order_unlocked_on_top: 'false'});
        });
    });
});
