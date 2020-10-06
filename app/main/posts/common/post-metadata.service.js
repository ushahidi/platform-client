const { findLastIndex } = require('underscore');

module.exports = PostMetadataService;

PostMetadataService.$inject = [
    'Util',
    'UserEndpoint',
    'ContactEndpoint',
    '$rootScope'
];

function PostMetadataService(
    Util,
    UserEndpoint,
    ContactEndpoint,
    $rootScope
) {
    var PostMetadataService = {
        // Format source (fixme!)
        formatSource: function (source) {
            if (source === 'sms') {
                return 'SMS';
            } else if (source) {
                // Uppercase first character
                return source.charAt(0).toUpperCase() + source.slice(1);
            } else {
                return 'Web';
            }
        },
        loadUser: function (post) {
            if (post.user && post.user.id && $rootScope.hasPermission('Manage Users')) {
                return UserEndpoint.get({id: post.user.id});
            } else {
                return post.user;
            }
        },
        loadContact: function (post) {
            if (!post.user && post.contact && post.contact.id) {
                return ContactEndpoint.get(
                    { id: post.contact.id, ignore403: true },
                    (resp) => {
                        //what should we do here??? console.log(resp);
                    },
                    angular.noop
                );
            } else {
                return post.contact;
            }
        },
        validateUser: function () {
            if ($rootScope.hasPermission('Manage Users')) {
                return true;
            } else {
                return false;
            }
        }
    };

    return Util.bindAllFunctionsToSelf(PostMetadataService);
}
