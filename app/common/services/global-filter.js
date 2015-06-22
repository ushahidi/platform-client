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

    var filterDefaults = {
        keyword: '',
        start_date: '',
        end_date: '',
        location: '',
        within_km: '1'
    };

    var GlobalFilter = {
        tags: [],
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
        post_types: [],
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
        post_statuses: [],
        getSelectedPostStatuses: function () {
            return _.pluck(_.where(this.post_statuses, { selected: true }), 'name');
        },
        hasSelectedPostStatuses: function () {
            return !_.isEmpty(this.getSelectedPostStatuses());
        },
        clearSelectedPostStatuses: function () {
            _.each(this.post_statuses, function (postStatus) {
                postStatus.selected = false;
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

            var selected_statuses = this.getSelectedPostStatuses();
            console.log(selected_statuses);
            if (!_.isEmpty(selected_statuses)) {
                query.status = selected_statuses.join(',');
            }

            if (this.keyword) {
                query.q = this.keyword;
            }
            if (this.start_date) {
                query.created_after = this.start_date;
            }
            if (this.end_date) {
                query.created_before = this.end_date;
            }

            if (this.location) {
                query.center_point = this.location;
                query.within_km = this.within_km || 10;
            }

            return query;
        },
        getFilterCount: function () {
            return _.keys(this.getPostQuery()).length;
        },
        clearSelected: function () {
            _.each(filterDefaults, _.bind(function (value, key) {
                this[key] = value;
            }, this));
            // Special handling for tags, post types and post statuses
            this.clearSelectedTags();
            this.clearSelectedPostTypes();
            this.clearSelectedPostStatuses();
        },
        getDefaults: function () {
            return _.extend({}, filterDefaults, {
                tags: [],
                post_types: [],
                post_statuses: []
            });
        }
    };

    // Add default filter values
    angular.extend(GlobalFilter, filterDefaults);

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
    
    GlobalFilter.post_statuses = {
                  'draft': {
                    'name': 'draft',
                    'selected': false
                  },
                  'published': {
                    'name': 'published',
                    'selected': false
                  }
                }


    return Util.bindAllFunctionsToSelf(GlobalFilter);

}];
