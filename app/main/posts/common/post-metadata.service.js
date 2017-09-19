module.exports = PostMetadataService;

PostMetadataService.$inject = [
    'Util',
    'UserEndpoint',
    'ContactEndpoint'
];

function PostMetadataService(
    Util,
    UserEndpoint,
    ContactEndpoint
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
            if (post.user && post.user.id) {
                return UserEndpoint.getFresh({id: post.user.id});
            }
        },
        loadContact: function (post) {
            if (!post.user && post.contact && post.contact.id) {
                return ContactEndpoint.get(
                    { id: post.contact.id, ignore403: true },
                    angular.noop,
                    angular.noop
                );
            }
        }
    };

    return Util.bindAllFunctionsToSelf(PostMetadataService);
}
