module.exports = [function () {
    return {
        tags: [],
        form: [],
        set: [],
        current_stage: [],
        getPostQuery: function () {
            return {
                q: 'dummy'
            };
        },
        options: {
            tags: {},
            collections: {},
            forms: {}
        },
        loadInitialData: function () {},
        getDefaults: function () {},
        setSelected: function () {},
        clearSelected: function () {}
    };
}];
