module.exports = [
    '_',
function(
    _
) {
    var helper = {
        roles: [
            // TODO: make this an endpoint
            {
                name: 'guest',
                display_name: 'Guest',
            },
            {
                name: 'user',
                display_name: 'Member',
            },
            {
                name: 'admin',
                display_name: 'Admin',
            }
        ],
        getRole: function(role, roles) {
            if (!roles) {
                roles = helper.roles;
            }
            var match = _.findWhere(roles, {name: role});
            return match ? match.display_name : role;
        }
    };
    return helper;
}];
