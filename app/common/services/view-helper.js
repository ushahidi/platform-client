module.exports = [
    '_',
    'Config',
    'ConfigEndpoint',
    '$translate',
function (
    _,
    Config,
    ConfigEndpoint,
    $translate
) {
    var allViews = [
            {
                name: 'map',
                display_name: $translate.instant('view_tabs.map')
            },
            {
                name: 'list',
                display_name: $translate.instant('view_tabs.list')
            },
            {
                name: 'chart',
                display_name: $translate.instant('view_tabs.chart')
            },
            {
                name: 'timeline',
                display_name: $translate.instant('view_tabs.timeline')
            }
        ],
        availableViews = [],

    PostViewHelper = {
        views: function (allViews) {
            return allViews ? allViews : availableViews;
        },
        getView: function (view, views) {
            if (!views) {
                views = allViews;
            }
            var match = _.findWhere(views, {name: view});
            return match ? match.display_name : view;
        },
        isViewAvailable: function (view) {
            return _.findWhere(availableViews, {name: view});
        },
        getDefault: function (views) {
            if (!views) {
                views = allViews;
            }

            // default view is set to map for the time being.
            var match = _.findWhere(views, {name: ''});
            return match ? match.display_name : 'Map';
        }
    };

    // Push available views into array
    // Rely on JS magic to
    var populateAvailableView = function (featureConfig) {
        _.each(allViews, function (view) {
            if (featureConfig.views[view.name]) {
                availableViews.push(view);
            }
        });
    };

    if (_.isEmpty(Config.features)) {
        ConfigEndpoint.get({ id: 'features' }, populateAvailableView);
    } else {
        populateAvailableView(Config.features);
    }

    return PostViewHelper;
}];
