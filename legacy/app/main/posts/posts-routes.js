module.exports = [
    '$stateProvider',
    '$urlMatcherFactoryProvider',
function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    $urlMatcherFactoryProvider.strictMode(false);

    let resolveCollection = ['$transition$', 'CollectionEndpoint', 'PostFilters', function ($transition$, CollectionEndpoint, PostFilters) {
        if ($transition$.params().collectionId) {
            return CollectionEndpoint.get({collectionId: $transition$.params().collectionId}).$promise;
        } else if (PostFilters.getMode() === 'collection') {
            return PostFilters.getModeEntity('collection');
        }
    }];

    let resolveSavedSearch = ['$transition$', 'SavedSearchEndpoint', 'PostFilters', function ($transition$, SavedSearchEndpoint, PostFilters) {
        if ($transition$.params().savedSearchId) {
            return SavedSearchEndpoint.get({id: $transition$.params().savedSearchId}).$promise;
        } else if (PostFilters.getMode() === 'savedsearch') {
            return PostFilters.getModeEntity('savedsearch');
        }
    }];

    $stateProvider
    .state(
        {
            name: 'posts',
            abstract: true,
            params: {
                filterState: {value: null, squash: true}
            },
            resolve: {
                collection: resolveCollection,
                savedSearch: resolveSavedSearch,
                filters: ['PostFilters', (PostFilters) => {
                    return PostFilters.getFilters();
                }]
            },
            onEnter: ['$transition$', 'PostFilters', function ($transition$, PostFilters) {
                if ($transition$.params().filterState) {
                    PostFilters.setFilters($transition$.params().filterState);
                }
            }]
        }
    )
    .state(
        {
            url: '^/savedsearches/{savedSearchId:int}',
            name: 'posts.savedsearchRedirector',
            resolve: {
                savedSearch: resolveSavedSearch
            },
            onEnter: ['$state', 'savedSearch', function ($state, savedSearch) {
                if (savedSearch.view === 'data' || savedSearch.view === 'list') {
                    $state.go('posts.data', {savedSearchId: savedSearch.id});
                } else {
                    $state.go('posts.map.all', {savedSearchId: savedSearch.id});
                }
            }]
        }
    )
    .state(
        {
            url: '^/collections/{collectionId:int}',
            name: 'posts.collectionRedirector',
            resolve: {
                collection: resolveCollection
            },
            onEnter: ['$state', 'collection', function ($state, collection) {
                if (collection.view === 'data' || collection.view === 'list') {
                    $state.go('posts.data.collection', {collectionId: collection.id});
                } else {
                    $state.go('posts.map.collection', {collectionId: collection.id});
                }
            }]
        }
    )
    /*.state(
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
                  *\/
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
    )*/

    /**
     * @uirouter-refactor
     * we need to  be able to set mode-context as collectionModeContext or as savedSearchModeContext
     * without the route since the user would land in /views/map after the redirect
     */
    .state(
        {
            url: '^/savedsearches/{savedSearchId:int}/data',
            name: 'posts.data.savedsearch',
            params: {
                activeCol: {value: 'timeline', squash: true}
            },
            resolve: {
                savedSearch: resolveSavedSearch
            },
            onEnter: ['PostFilters', '$state', 'savedSearch', function (PostFilters, $state, savedSearch) {
                /**
                 * we need to make sure that we don't replace the postfilter values
                 * if we have an entity id already set in the PostFilters service.
                 * So if we have a saved search but it's not yet set in the modeState inside PostFilters,
                 * we want to replace everything (since it means the user is either fresh loading or changed saved searches)
                 * but in other scenarios we need keep our filters in postfilters as they are.
                 * Q: What happens if we just replace PostFilters.setFilters(savedSearch.filter); all the time?
                 * A: You won't retain filters as you move around the app, which is terrible usability.
                 */
                if (savedSearch && PostFilters.getModeId() !== savedSearch.id) {
                    PostFilters.setMode('savedsearch', savedSearch);
                    PostFilters.setFilters(savedSearch.filter);
                }
            }]
        }
    )
    .state(
        {
            url: '^/collections/{collectionId:int}/data',
            name: 'posts.data.collection',
            onEnter: ['$state', 'PostFilters', 'collection', function ($state, PostFilters, collection) {
                PostFilters.setMode('collection', collection);
            }],
            params: {
                activeCol: {value: 'timeline', squash: true}
            },
            resolve: {
                collection: resolveCollection
            }
        }
    )
    .state(
        {
            name: 'posts.map',
            abstract: true,
            component: 'postViewMap',
            params: {
                filterState: {value: null, squash: true}
            }
        }
    )
    .state(
        {
            url: '/views/map',
            name: 'posts.map.all',
            views: {
                'mode-context': 'modeContext'
            },
            onEnter: ['$state', 'PostFilters', function ($state, PostFilters) {
                if (PostFilters.getMode() === 'savedsearch') {
                    $state.go('posts.map.savedsearch', {savedSearchId: PostFilters.getModeId()});
                } else if (PostFilters.getMode() === 'collection') {
                    $state.go('posts.map.collection', {collectionId: PostFilters.getModeId()});
                }
            }]
        }
    )
    .state(
        {
            url: '^/savedsearches/{savedSearchId:int}/map',
            name: 'posts.map.savedsearch',
            views: {
                'mode-context': 'savedSearchModeContext'
            },
            onEnter: ['$state', 'PostFilters', 'savedSearch', function ($state, PostFilters, savedSearch) {
                /**
                 * we need to make sure that we don't replace the postfilter values
                 * if we have an entity id already set in the PostFilters service.
                 * So if we have a saved search but it's not yet set in the modeState inside PostFilters,
                 * we want to replace everything (since it means the user is either fresh loading or changed saved searches)
                 * but in other scenarios we need keep our filters in postfilters as they are.
                 * Q: What happens if we just replace PostFilters.setFilters(savedSearch.filter); all the time?
                 * A: You won't retain filters as you move around the app, which is terrible usability.
                 */
                if (savedSearch && PostFilters.getModeId() !== savedSearch.id) {
                    PostFilters.setMode('savedsearch', savedSearch);
                    PostFilters.setFilters(savedSearch.filter);
                }
            }],
            resolve: {
                savedSearch: resolveSavedSearch
            }
        }
    )
    /**
     * @uirouter-refactor
     * we need to  be able to set mode-context as collectionModeContext or as savedSearchModeContext
     * without the route since the user would land in /views/map after the redirect
     */
        .state(
        {
            url: '^/collections/{collectionId:int}/map',
            name: 'posts.map.collection',
            views: {
                'mode-context': 'collectionModeContext'
            },
            onEnter: ['$state', 'PostFilters', 'collection', function ($state, PostFilters, collection) {
                PostFilters.setMode('collection', collection);
            }],
            resolve: {
                collection: resolveCollection
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
                post: ['$transition$', 'PostsSdk', function ($transition$, PostsSdk) {
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
            name: 'posts.noui',
            url: '/map/noui',
            controller: require('./views/map/post-view-noui.controller.js'),
            template: require('./views/map/post-view-noui.html'),
            params: {
                view: {value: 'noui', squash: true}
            }
        }
    )
    .state(
        {
            name: 'postCreate',
            url: '/posts/create/:id',
            controller: require('./modify/post-create.controller.js'),
            template: require('./modify/main.html')
        }
    )
    // .state(
    //     {
    //         name: 'postEdit',
    //         url: '/posts/:id/edit',
    //         controller: require('./modify/post-edit.controller.js'),
    //         template: require('./modify/main.html')
    //     }
    // )
    ;

}];
