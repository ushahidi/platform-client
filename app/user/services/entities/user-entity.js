module.exports = [
function(
) {
    return function(data) {
        return angular.extend({}, {
            id: 0,
            email: '',
            realname: '',
            username: '',
            logins: 0,
            created: null,
            updated: null,
            role: 'user'
        }, data);
    };
}];
