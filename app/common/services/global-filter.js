module.exports = [
    'TagEndpoint',
    'FormEndpoint',
    // 'SetEndpoint',
    'Util',
    '_',
function (
    TagEndpoint,
    FormEndpoint,
    // SetEndpoint
    Util,
    _
) {

    var GlobalFilter = {
        tags: [],
        post_types: [],
        keyword: '',
        start_date: '',
        end_date: '',
        location: '',
        within_km: '',
        getSelectedTags: function () {
            return _.pluck(_.where(this.tags, { selected: true }), 'id');
        },
        hasSelectedTags: function () {
            return !_.isEmpty(this.getSelectedTags());
        },
        clearSelectedTags: function () {
            _.each(this.tags, function (tag) {
                tag.selected = false;
            });
        },
        getSelectedPostTypes: function () {
            return _.pluck(_.where(this.post_types, { selected: true }), 'id');
        },
        hasSelectedPostTypes: function () {
            return !_.isEmpty(this.getSelectedPostTypes());
        },
        clearSelectedPostTypes: function () {
            _.each(this.post_types, function (postType) {
                postType.selected = false;
            });
        },
        getPostQuery: function () {
            var query = {};

            var selected_tags = this.getSelectedTags();
            if (!_.isEmpty(selected_tags)) {
                query.tags = selected_tags.join(',');
            }

            var selected_types = this.getSelectedPostTypes();
            if (!_.isEmpty(selected_types)) {
                query.form = selected_types.join(',');
            }

            if (this.keyword) {
                query.q = this.keyword;
            }
            if (this.start_date) {
                query.updated_after = this.start_date;
            }
            if (this.end_date) {
                query.updated_before = this.end_date;
            }

            if (this.location) {
                query.center_point = this.location;
                query.within_km = this.within_km || 10;
            }

            return query;
        },
        getFilterCount: function () {
            return _.keys(this.getPostQuery()).length;
        }
    };

    TagEndpoint.get().$promise.then(function (response) {
        GlobalFilter.tags = response.results;
    });

    FormEndpoint.get().$promise.then(function (response) {
        GlobalFilter.post_types = response.results;
    });

    // @todo - uncomment when sets are ready
    // SetEndpoint.get().$promise.then(function(response) {
    //     GlobalFilter.sets = response.results;
    // });

    return Util.bindAllFunctionsToSelf(GlobalFilter);

}];
