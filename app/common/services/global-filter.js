module.exports = [
    'TagEndpoint',
    // 'SetEndpoint',
    'Util',
    '_',
function(
    TagEndpoint,
    // SetEndpoint
    Util,
    _
) {

    var GlobalFilter = {
        tags: [],
        keyword: '',
        start_date: '',
        end_date: '',
        location: '',
        within_km: '',
        getSelectedTags: function() {
            return _.pluck(_.where(this.tags, { selected: true }), 'id');
        },
        hasSelectedTags: function() {
            return !_.isEmpty(this.getSelectedTags());
        },
        clearSelectedTags: function() {
            _.each(this.tags, function(tag) {
                tag.selected = false;
            });
        },
        getPostQuery: function() {
            var query = {};

            var selected_tags = this.getSelectedTags();
            if (!_.isEmpty(selected_tags)) { query.tags = selected_tags; }

            if (this.keyword)    { query.q = this.keyword;                }
            if (this.start_date) { query.updated_after = this.start_date; }
            if (this.end_date)   { query.updated_before = this.end_date;  }

            if (this.location) {
                query.center_point = this.location;
                query.within_km = this.within_km || 10;
            }

            return query;
        },
    };

    TagEndpoint.get().$promise.then(function(response) {
        GlobalFilter.tags = response.results;
    });

    // @todo - uncomment when sets are ready
    // SetEndpoint.get().$promise.then(function(response) {
    //     GlobalFilter.sets = response.results;
    // });

    return Util.bindAllFunctionsToSelf(GlobalFilter);

}];
