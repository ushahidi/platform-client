module.exports = [
    'CONST',
function (
    CONST
) {
    return function (data) {
        return angular.extend({}, {
            // id: 0,
            title: '',
            content: '',
            locale: CONST.DEFAULT_LOCALE,
            values: {},
            completed_stages: [],
            published_to: [],
            post_date: new Date()
        }, data);
    };
}];
