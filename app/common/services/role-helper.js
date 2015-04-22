module.exports = [
    '_',
function(
    _
) {
    var RoleHelper = {
        roles: [
            // TODO: make this an endpoint
            {
                name: '',
                display_name: 'Everyone',
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
                roles = RoleHelper.roles;
            }
            var match = _.findWhere(roles, {name: role});
            return match ? match.display_name : role;
        },
        getDefault: function(roles) {
            if(!roles) {
                roles = RoleHelper.roles;
            }
            
            // assuming the default role has a blank name - could change this to a db
            // field but seemed a bit heavy-handed
            var match = _.findWhere(roles, {name: ''});
            return match ? match.display_name : null;
        }
    };
    return RoleHelper;
}];
