module.exports = [function () {
    var filterState = {
        q: '',
        created_after: '',
        created_before: '',
        status: ['published'],
        published_to: '',
        center_point: '',
        within_km: '1',
        current_stage: [],
        tags: [],
        form: [],
        set: []
    };
    var defaultFilters = {
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
            form: [1, 2],
            set: [],
            user: false
        };

    var filterMode = 'all';

    return {
        filterState: filterState,
        getDefaults: function () {
            return defaultFilters;
        },
        getQueryParams: function (filters) {
            return filters;
        },
        getFilters: function () {
            return filterState;
        },
        setFilters: function () {},
        clearFilters: function () {},
        clearFilter: function () {},
        hasFilters: function () {},
        getActiveFilters: function (filters) {
            return filters;
        },
        setMode: function () {
        },
        getMode: function () {
            return filterMode;
        }
    };
}];
