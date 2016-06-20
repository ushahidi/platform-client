var ROOT_PATH = '../../../../';

describe('post view list directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        PostFilters,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postViewList', require(ROOT_PATH + 'app/post/views/post-view-list.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {})
        .value('moment', function () {
            return {
                subtract : function () {
                    return this;
                },
                fromNow : function () {
                    return '';
                },
                isSame : function () {
                    return true;
                }
            };
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _PostFilters_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        PostFilters = _PostFilters_;
        $scope.isLoading = true;
        $scope.filters = {};
        element = '<post-view-list filters="filters" is-loading="isLoading"></post-view-list>';

        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load initial values', function () {
        expect(isolateScope.currentPage).toEqual(1);
    });

    it('should update the number of items per page', function () {
        isolateScope.itemsPerPageChanged(1);
        expect(isolateScope.itemsPerPage).toEqual(1);
    });

    it('should check if the user has bulk action permissions', function () {
        var result = isolateScope.userHasBulkActionPermissions();
        expect(result).toBe(true);
    });

    it('should check if filters have been set', function () {
        spyOn(PostFilters, 'hasFilters').and.returnValue(false);

        isolateScope.filters = {
            status: 'all'
        };

        var result = isolateScope.hasFilters();

        expect(result).toBe(false);
        expect(PostFilters.hasFilters).toHaveBeenCalledWith({ status: 'all' });
    });

    it('should delete selected posts', function () {
        spyOn(Notify, 'confirmDelete').and.callThrough();
        isolateScope.posts[0].id = 'pass';
        isolateScope.selectedPosts.push = 'pass';

        isolateScope.deletePosts();

        $rootScope.$digest();
        expect(Notify.confirmDelete).toHaveBeenCalled();
    });
});
