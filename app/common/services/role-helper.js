module.exports = [
    '_',
function(
    _
) {
    return {
        getRole: function(roles, role) {
            var match = _.findWhere(roles, {name: role});
            return match ? match.display_name : role;
        }
    };
}];
