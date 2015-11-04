module.exports = [
    '_',
function (
    _
) {
    var allViews = [
            {
                name: 'map',
                display_name: 'Map'
            },
            {
                name: 'list',
                display_name: 'List'
            },
            {
                name: 'chart',
                display_name: 'Chart'
            },
            {
                name: 'timeline',
                display_name: 'Timeline'
            }
        ],

    PostViewHelper = {
        views: function () {
            return allViews;
        },
        getView: function (view, views) {
            if (!views) {
                views = allViews;
            }
            var match = _.findWhere(views, {name: view});
            return match ? match.display_name : view;
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
    return PostViewHelper;
}];
