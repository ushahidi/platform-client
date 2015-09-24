module.exports = [
    '_',
function (
    _
) {
    var allRoles = [
            {
                name: 'user',
                display_name: 'Member'
            },
            {
                name: 'admin',
                display_name: 'Admin'
            }
        ],

    rolesWithoutGuest = _.filter(allRoles, function (role) {
        return role.name !== 'guest';
    }),

    RoleHelper = {
        roles: function (includeGuest) {
            return includeGuest ? allRoles : rolesWithoutGuest;
        },
        getRole: function (role, roles) {
            if (!roles) {
                roles = allRoles;
            }
            var match = _.findWhere(roles, {name: role});
            return match ? match.display_name : role;
        },
        getDefault: function (roles) {
            if (!roles) {
                roles = allRoles;
            }

            // assuming the default role has a blank name - could change this to a db
            // field but seemed a bit heavy-handed
            var match = _.findWhere(roles, {name: ''});
            return match ? match.display_name : null;
        }
    };
    return RoleHelper;
}];
