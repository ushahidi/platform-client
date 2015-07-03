module.exports = [
    'TagEndpoint',
    'FormEndpoint',
    'FormStageEndpoint',
    // 'SetEndpoint',
    'Util',
    '_',
function (
    TagEndpoint,
    FormEndpoint,
    FormStageEndpoint,
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
        post_status: '',
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
        post_types: {},
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
        post_stages: {},
        getSelectedPostStages: function () {
            var stages = [];

            _.each(this.post_stages, function (item) {
                stages = stages.concat(
                _.chain(item.stages)
                .filter(function (i) {
                    return i.selected;
                })
                .pluck('id')
                .value()
              );
            });
            return stages;
        },
        hasSelectedPostStages: function () {
            return !_.isEmpty(this.getSelectedPostStages());
        },
        clearSelectedPostStages: function () {
            _.each(this.post_stages, function (postStages) {
                _.each(postStages, function (postStage) {
                    postStage.selected = false;
                });
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
            query.status = this.post_status;
            if (_.isEmpty(query.status)) {
                query.status = 'all';
            }

            var selected_stages = this.getSelectedPostStages();
            if (!_.isEmpty(selected_stages)) {
                query.stage = selected_stages.join(',');
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
        },
        getDefaults: function () {
            return _.extend({}, filterDefaults, {
                tags: [],
                post_types: [],
                post_status: '',
                post_stages: []
            });
        }
    };

    // Add default filter values
    angular.extend(GlobalFilter, filterDefaults);

    TagEndpoint.get().$promise.then(function (response) {
        GlobalFilter.tags = response.results;
    });

    FormEndpoint.get().$promise.then(function (response) {
        angular.forEach(response.results, function (value, key) {
          GlobalFilter.post_types[value.id] = value;
          FormStageEndpoint.get({formId: value.id}).$promise.then(function (response) {
            if (response.results.length) {
                var form_id = response.results[0].form_id;
                GlobalFilter.post_stages[form_id] = {
                  'stages': response.results,
                  'form_name': GlobalFilter.post_types[form_id].name
              };
            }
        });
      });
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
    };
    return Util.bindAllFunctionsToSelf(GlobalFilter);

}];
