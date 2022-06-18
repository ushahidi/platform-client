module.exports = [
    '$q',
    'ConfigEndpoint',
    'UserEndpoint',
function ($q, ConfigEndpoint, UserEndpoint) {
    // Utility for collecting user properties from application state and pushing
    // them to the datalayer
    function getUserPropertiesPromise() {
        var userProps = $q.defer();

        var site = $q.defer();
        var multisite = $q.defer();
        var user = $q.defer();

        ConfigEndpoint.get({id: 'site'}).$promise.then(function (x) {
            site.resolve(x);
        });
        ConfigEndpoint.get({id: 'multisite'}).$promise.then(function (x) {
            multisite.resolve(x);
        });
        UserEndpoint.get({id: 'me'}).$promise.then(function (x) {
            if (x.id && x.role) {
                // According to data dictionary:
                //   https://docs.google.com/document/d/1ulZerckIGun-mv4ASu2nEFGFTpqcYwBXd3HR95eKj68
                x.role_level = x.role == 'admin' ? 'admin' : 'member';
            }
            user.resolve(x);
        }).catch(function () {
            user.resolve(null);
        })

        $q.all([site.promise, multisite.promise, user.promise]).then(function (results) {
            var site = results[0] || {};
            var multisite = results[1] || {};
            var user = results[2] || {};

            // This is a composition of the user id and deployment id, because each user must be unique
            // in the analytics data warehouse
            var scopedUserId = undefined;
            if (user.id) {
                scopedUserId = String(user.id) + "," + String(multisite.site_id || null);
            }

            userProps.resolve({
                deployment_url: multisite.site_fqdn || window.location.host ,
                deployment_id: multisite.site_id || null,
                deployment_name: site.name || undefined,
                user_id: scopedUserId,
                user_role: user.role_level || undefined,
                browser_language: navigator.language
                ? navigator.languages[0]
                : (navigator.language || navigator.userLanguage)
            });
        });

        return userProps;
    }

    function triggerRefresh() {
        getUserPropertiesPromise().promise.then(function (userProps) {
            let event = new CustomEvent('datalayer:userprops', { detail: userProps });
            window.dispatchEvent(event);
        });
    }

    // Initialize user properties along with this module
    triggerRefresh();
    
    // Add event listener to refresh user properties on demand
    window.addEventListener('ush:analytics:refreshUserProperties', function () {
        triggerRefresh();
    });
    
}];
