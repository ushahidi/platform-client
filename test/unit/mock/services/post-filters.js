module.exports = [function () {
    var filterState = {
        q: '',
        created_after: '',
        created_before: '',
        status: 'published',
        published_to: '',
        center_point: '',
        within_km: '1',
        current_stage: [],
        tags: [],
        form: [],
        set: []
    };
    return {
        filterState: filterState,
        getDefaults: function () {},
        getQueryParams: function (filters) {
            return filters;
        },
        getFilters: function () {
            return filterState;
        },
        setFilters: function () {},
        clearFilters: function () {},
        clearFilter: function () {},
        hasFilters: function () {}
    };
}];
