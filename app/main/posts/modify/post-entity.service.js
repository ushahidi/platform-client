module.exports = [
    'CONST',
function (
    CONST
) {
    return function (data) {
        return angular.extend({}, {
            // id: 0,
            title: '',
            description: '',
            locale: CONST.DEFAULT_LOCALE,
            post_content: [],
            completed_stages: [],
            published_to: [],
            post_date: new Date(),
            enabled_languages: {}
        }, data);
    };
}];
