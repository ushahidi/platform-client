module.exports = [
    'API_URL',
    'DEFAULT_LOCALE',
function(
    API_URL,
    DEFAULT_LOCALE
) {
    return function(data) {
        return angular.extend({}, {
            id: 0,
            title: '',
            content: '',
            locale: DEFAULT_LOCALE,
            status: 'draft'
        }, data);
    };
}];
