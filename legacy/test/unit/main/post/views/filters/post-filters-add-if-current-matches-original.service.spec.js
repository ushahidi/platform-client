describe('filters with saved search', function () {

    var
        PostFilters,
        Notify;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.service('PostFilters', require('app/common/services/post-filters.service.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_Notify_, _PostFilters_) {
        /**
         * inject deps
         */
        Notify = _Notify_;
        PostFilters = _PostFilters_;
    }));
    describe('PostFilters.addIfCurrentObjectMatchesOriginal ', function () {
        it ('should not add the currentFilters value to the saved search if there are new ones that are not part of the original Saved Search', function () {
            var currentSavedSearch = {tags: [1, 2, 3]};
            var originalSavedSearch = {tags: [1, 2, 3]};
            var currentFilters = {tags: [1, 2, 3, 4]};
            var savedSearchResult = PostFilters.addIfCurrentObjectMatchesOriginal(currentSavedSearch, originalSavedSearch, currentFilters);
            expect(savedSearchResult).toEqual({tags: [1, 2, 3]});
        });
        it ('should not add the currentFilters value to the saved search if there are some deleted values and some new values vs the original Saved Search', function () {
            var currentSavedSearch = {tags: [1, 2, 3]};
            var originalSavedSearch = {tags: [1, 2, 3]};
            var currentFilters = {tags: [1, 2, 4]};
            var savedSearchResult = PostFilters.addIfCurrentObjectMatchesOriginal(currentSavedSearch, originalSavedSearch, currentFilters);
            expect(savedSearchResult).toEqual({tags: [1, 2]});
        });
        it ('should re-add the currentFilters 4 value to the saved search when it was removed and re-added', function () {
            var currentSavedSearch = {tags: [1, 2]};
            var originalSavedSearch = {tags: [1, 2, 3]};
            var currentFilters = {tags: [1, 2, 3, 4]};
            var savedSearchResult = PostFilters.addIfCurrentObjectMatchesOriginal(currentSavedSearch, originalSavedSearch, currentFilters);
            expect(savedSearchResult).toEqual({tags: [1, 2, 3]});
        });

    });
});
