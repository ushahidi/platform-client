module.exports = [
    '$scope',
    'gravatar',
    'UserEndpoint',
function(
    $scope,
    gravatar,
    UserEndpoint
) {
    var roleAlias = {
        all: '',
        member: 'user'
    },
    getRealRole = function (alias) {
        if (typeof roleAlias[alias] !== 'undefined') {
            return roleAlias[alias];
        }
        return alias;
    },
    getRoleAlias = function (role) {
        for (var alias in roleAlias) {
            if (roleAlias[alias] === role) {
                return alias;
            }
        }
        return role;
    };

    $scope.title = 'Users';
    $scope.users = [];
    $scope.roles = ['all', 'admin', 'member', 'guest'];
    $scope.role  = $scope.roles[0];
    $scope.count = {};
    $scope.q;

    $scope.getRoleName = getRoleAlias;

    $scope.isActiveRole = function(role) {
        return $scope.role === role;
    };

    $scope.getGravatar = function(user) {
        return gravatar.url(user.email, {default: 'retro'});
    };

    $scope.selectRole = function(role) {
        $scope.role  = role;
        $scope.users = UserEndpoint.query({
            role: getRealRole(role)
        });
    };

    $scope.searching = false;
    $scope.searchUsers = function() {
        console.log('starting search');
        $scope.searching = true;
        UserEndpoint.query({
            role: getRealRole($scope.role),
            q: $scope.q
        }, function(users) {
            $scope.users = users;
            $scope.searching = false;
        });
    };

    $scope.$watchCollection('users', function(users) {
        console.log('users changed');
        // initialize count for each role
        angular.forEach($scope.roles, function(role) {
            $scope.count[role] = 0;
        });
        angular.forEach(users, function(user) {
            $scope.count.all++;
            $scope.count[getRoleAlias(user.role)]++;
        });
    });

    // hydrate!
    $scope.users = UserEndpoint.query();
}];
