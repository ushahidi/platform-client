describe('filters-posts directive', function () {

    var $rootScope,
        $scope,
        PostFilters,
        FocusTrap,
        element,
        isolateScope,
        $compile,
        mockState = {
            '$current': {
                name: 'posts.data',
                includes: {
                    'posts': true,
                    'posts.data': true
                }
            }
        };
;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();
        testApp
        .directive('filterPosts', require('app/main/posts/views/filters/filter-posts.directive'))
        .service('PostFilters', require('app/main/posts/views/post-filters.service.js'))
        .service('$state', function () {
            return mockState;
        })
        ;
        angular.mock.module('testApp');
    });
    var defaults = {
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
        form: [1, 2, 3, 4],
        set: [],
        user: false,
        source: ['sms', 'twitter','web', 'email']
    };
    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _PostFilters_, _FocusTrap_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        PostFilters = _PostFilters_;
        FocusTrap = _FocusTrap_;

        $scope.filters = defaults;
        $scope.onOpen = jasmine.createSpy();
        $scope.onClose = jasmine.createSpy();

        element = '<filter-posts filters="filters" on-open="onOpen()" on-close="onClose()"></filters-dropdown>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();

    }));

    describe('test directive functions', function () {

        const mutationObserverMock = class {
            constructor(callback) {}
            disconnect() {}
            observe(element, initObject) {}
        }
        global.MutationObserver = mutationObserverMock;

        it('reactiveFilters should be false', function () {
            expect(PostFilters.reactiveFilters).toEqual(false); // revisit where we set the default for this?
        });
        it('should enable reactiveFilters when I call applyFiltersLocked', function () {
            expect(PostFilters.reactiveFilters).toEqual(false);
            isolateScope.applyFilters();
            expect(PostFilters.reactiveFilters).toEqual(true);
        });
        it('should clear PostFilters when calling clearFilters', function () {
            isolateScope.removeQueryFilter();
            expect(isolateScope.filters.q).toEqual('');
        });
        it('should close dropdown when pressing escape', function () {
            spyOn(isolateScope, 'hideDropdown').and.callThrough();
            let event = {keyCode: 13};
            isolateScope.toggleDropdown(event);
            expect(isolateScope.hideDropdown).toHaveBeenCalled();
            expect(isolateScope.status.isopen).toEqual(false);
        });
        it('should close dropdown when pressing enter', function () {
            spyOn(isolateScope, 'hideDropdown').and.callThrough();
            let event = {keyCode: 27};
            isolateScope.toggleDropdown(event);
            expect(isolateScope.hideDropdown).toHaveBeenCalled();
            expect(isolateScope.status.isopen).toEqual(false);
        });
        it('should open dropdown when pressing any key except enter and escape', function () {
            spyOn(isolateScope, 'showDropdown').and.callThrough();
            let event = {keyCode: 22};
            isolateScope.toggleDropdown(event);
            expect(isolateScope.showDropdown).toHaveBeenCalled();
            expect(isolateScope.status.isopen).toEqual(true);
        });
    });
});
