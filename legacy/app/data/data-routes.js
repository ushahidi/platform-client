angular.module('ushahidi.data.routes', [])

.config([
    '$stateProvider',
    '$urlMatcherFactoryProvider',
function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    $urlMatcherFactoryProvider.strictMode(false);

    /* =================================================
    Lazy load data module depending on where user goes to
    first views/data, post-create (and postcards)
     ==================================================*/

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
            }],
            lazyLoad: function ($transition$) {
                const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
                return System.import('@ushahidi/legacy-data').then(mod => {
                    $ocLazyLoad.load(mod.DATA_MODULE);
                });
            }
        }
    )
    .state(
        {
            name: 'posts.data.detail',
            url: '^/posts/:postId',
            component: 'postDetailData',
            params: {
                activeCol: {value: 'post', squash: true}
            },
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                post: ['$transition$', 'PostsSdk', 'PostEndpoint', function ($transition$, PostsSdk) {
                    return PostsSdk.findPost($transition$.params().postId);
                }]
            }
        }
    )
    .state(
        {
            name: 'posts.data.edit',
            url: '^/posts/:postId/edit',
            component: 'postDataEditor',
            params: {
                activeCol: {value: 'post', squash: true}
            },
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                post: ['$transition$', 'PostsSdk', function ($transition$, PostsSdk) {
                    return PostsSdk.findPost($transition$.params().postId);
                }]
            }
        }
    )
    .state(
        {
            name: 'postCreate',
            url: '/posts/create/:id',
            controller: require('./post-create/post-create.controller.js'),
            template: require('./post-create/main.html'),
            lazyLoad: function ($transition$) {
                const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
                return System.import('/data.js').then(mod => {
                    $ocLazyLoad.load(mod.DATA_MODULE);
                });
            }
        }
    )
}]);
