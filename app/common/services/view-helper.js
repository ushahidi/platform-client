module.exports = [
    '$translate',
function (
    $translate
) {
    var allViews = [
        {
            name: 'map',
            display_name: $translate.instant('views.map')
        },
        {
            name: 'list',
            display_name: $translate.instant('views.list')
        },
        {
            name: 'data',
            display_name: $translate.instant('views.data')
        }
    ];

    function views() {
        return allViews;
    }

    return {
        views: views
    };
}];
