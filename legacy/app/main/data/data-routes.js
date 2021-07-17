module.exports = [
    '$stateProvider',
    '$urlMatcherFactoryProvider',
function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
    .state(
        {
            url: '/views/data',
            name: 'posts.data',
            params: {
                filterState: {value: null, squash: true},
                activeCol: {value: 'timeline', squash: true}
            },
            component: 'postViewData',
            resolve: {
                /**
                 * This is enabling the feature of loading with a selectedPost "selected" in the data mode left side.
                 * Nothing happens if there no postId except for not having a selectedPost.
                  */
                post: ['$transition$', 'PostsSdk', function ($transition$, PostsSdk) {
                    if ($transition$.params().postId) {
                        return PostsSdk.findPost($transition$.params().postId)
                    }
                }]
            },
            onEnter: ['$state', 'PostFilters', 'post', function ($state, PostFilters, post) {
                if (!post) {
                    if (PostFilters.getMode() === 'savedsearch') {
                        $state.go('posts.data.savedsearch', {savedSearchId: PostFilters.getModeId()});
                    } else if (PostFilters.getMode() === 'collection') {
                        $state.go('posts.data.collection', {collectionId: PostFilters.getModeId()});
                    }
                }
            }]
        }
    )

}];
