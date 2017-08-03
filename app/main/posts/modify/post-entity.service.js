module.exports = [
    'CONST',
    '$rootScope',
function (
    CONST,
    $rootScope
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
            post_date: new Date(),
            author_realname: $rootScope.currentUser ? $rootScope.currentUser.realname : '',
            author_email: $rootScope.currentUser ? $rootScope.currentUser.email : ''
        }, data);
    };
}];
