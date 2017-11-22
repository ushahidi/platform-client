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
            name: 'posts',
            abstract: true,
            params: {
                view: {value: null, squash: true},
                filterState: {value: null, squash: true}
            },
            resolve: {
                collection: ['$transition$', 'CollectionEndpoint', 'PostFilters', function ($transition$, CollectionEndpoint, PostFilters) {
                    if ($transition$.params().collectionId) {
                        return CollectionEndpoint.get({collectionId: $transition$.params().collectionId}).$promise;
                    } else if (PostFilters.getMode() === 'collection') {
                        return PostFilters.getModeEntity();
                    }
                }],
                savedSearch: ['$transition$', 'SavedSearchEndpoint', 'PostFilters', function ($transition$, SavedSearchEndpoint, PostFilters) {
                    if ($transition$.params().savedSearchId) {
                        return SavedSearchEndpoint.get({id: $transition$.params().savedSearchId}).$promise;
                    } else if (PostFilters.getMode() === 'savedsearch') {
                        return PostFilters.getModeEntity();
                    }
                }],
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
            url: '^/savedsearches/:savedSearchId',
            name: 'posts.savedsearchRedirector',
            onEnter: ['$state', 'savedSearch', function ($state, savedSearch) {
                if (savedSearch.view === 'data' || savedSearch.view === 'list') {
                    $state.go('posts.data.all', {savedSearchId: savedSearch.id, view: 'data'});
                } else {
                    $state.go('posts.map.all', {savedSearchId: savedSearch.id, view: 'map'});
                }
            }]
        }
    )
    .state(
        {
            url: '^/collections/:collectionId',
            name: 'posts.collectionRedirector',
            onEnter: ['$state', 'collection', function ($state, collection) {
                if (collection.view === 'data' || collection.view === 'list') {
                    $state.go('posts.data.collection', {collectionId: collection.id, view: 'data'});
                } else {
                    $state.go('posts.map.collection', {collectionId: collection.id, view: 'map'});
                }
            }]
        }
    )
    .state(
        {
            url: '/views/data',
            name: 'posts.data',
            params: {
                view: {value: 'data', squash: true},
                filterState: {value: null, squash: true},
                activeCol: {value: 'timeline', squash: true}
            },
            component: 'postViewData',
            resolve: {
                /**
                 * This is enabling the feature of loading with a selectedPost "selected" in the data mode left side.
                 * Nothing happens if there no postId except for not having a selectedPost.
                  */
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    if ($transition$.params().postId) {
                        return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                    }
                }]
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
            url: '^/savedsearches/:savedSearchId/data',
            name: 'posts.data.savedsearch',
            params: {
                activeCol: {value: 'timeline', squash: true}
            },
            onEnter: ['PostFilters', '$state', 'savedSearch', function (PostFilters, $state, savedSearch) {
                PostFilters.setMode('savedsearch', savedSearch);
                PostFilters.setFilters(savedSearch.filter);
                if (savedSearch.view === 'data' || savedSearch.view === 'list') {
                    $state.go('posts.data.all', {savedSearchId: savedSearch.id, view: 'data'});
                } else {
                    $state.go('posts.map.all', {savedSearchId: savedSearch.id, view: 'map'});
                }
            }]
        }
    )
    .state(
        {
            url: '^/collections/:collectionId/data',
            name: 'posts.data.collection',
            onEnter: ['$state', 'PostFilters', 'collection', function ($state, PostFilters, collection) {
                PostFilters.setMode('collection', collection);
            }],
            params: {
                activeCol: {value: 'timeline', squash: true}
            }
        }
    )
    .state(
        {
            name: 'posts.map',
            abstract: true,
            component: 'postViewMap',
            params: {
                view: {value: 'map', squash: true},
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
            }
        }
    )
    .state(
        {
            url: '^/savedsearches/:savedSearchId/map',
            name: 'posts.map.savedsearch',
            views: {
                'mode-context': 'savedSearchModeContext'
            },
            onEnter: ['$state', 'PostFilters', 'savedSearch', function ($state, PostFilters, savedSearch) {
                if (!PostFilters.getModeId() && savedSearch) {
                    PostFilters.setMode('savedsearch', savedSearch);
                    PostFilters.setFilters(savedSearch.filter);
                } else {
                    savedSearch = PostFilters.getModeEntity();
                }

                if (savedSearch.view === 'data' || savedSearch.view === 'list') {
                    $state.go('posts.data.all', {savedSearchId: savedSearch.id, view: 'data'});
                } else {
                    $state.go('posts.map.all', {savedSearchId: savedSearch.id, view: 'map'});
                }
            }]
        }
    )
    /**
     * @uirouter-refactor
     * we need to  be able to set mode-context as collectionModeContext or as savedSearchModeContext
     * without the route since the user would land in /views/map after the redirect
     */
        .state(
        {
            url: '^/collections/:collectionId/map',
            name: 'posts.map.collection',
            views: {
                'mode-context': 'collectionModeContext'
            },
            onEnter: ['$state', 'PostFilters', 'collection', function ($state, PostFilters, collection) {
                PostFilters.setMode('collection', collection);
            }]
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
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
            }
        }
    )
    .state(
        {
            name: 'posts.data.edit',
            url: '/posts/:postId/edit',
            component: 'postDataEditor',
            params: {
                activeCol: {value: 'post', squash: true}
            },
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
            }
        }
    )
    .state(
        {
            name: 'posts.noui',
            url: '/map/noui',
            controller: require('./views/post-view-noui.controller.js'),
            template: require('./views/post-view-noui.html'),
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
    .state(
        {
            name: 'postEdit',
            url: '/posts/:id/edit',
            controller: require('./modify/post-edit.controller.js'),
            template: require('./modify/main.html')
        }
    );

}];
