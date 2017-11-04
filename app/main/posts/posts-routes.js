module.exports = [
    '$stateProvider',
function (
    $stateProvider
) {

    $stateProvider
    //.state('/', {
    //     resolveRedirectTo: ['PostFilters', (PostFilters) => {
    //         let mode = PostFilters.getMode();
    //         let entityId = PostFilters.getModeId();
    //
    //         if (mode === 'collection') {
    //             return '/collections/' + entityId;
    //         } else if (mode === 'savedsearch') {
    //             return '/savedsearches/' + entityId;
    //         } else {
    //             return '/views/map';
    //         }
    //     }]
    // })
    .state({name: 'list.deprecated', url: '/views/list', redirectTo: '/views/data'})
    .state(
        {
            name: 'list',
            url: '/views/:view',
            controller: require('./views/post-views.controller.js'),
            template: require('./views/main.html'),
            onEnter: function ($state, $transition$) {
                if ($transition$.params().view === 'list') {
                    $state.go('list', {view: 'data'}, {reload: true});
                }
            }
        }
    )
    .state(
        {
            name: 'list.map.noui',
            url: '/map/noui',
            controller: require('./views/post-view-noui.controller.js'),
            template: require('./views/post-view-noui.html')
        }
    )
    /** @uirouter-refactor this implies that we will find out selected post details from the data view in /views/data/posts/6539
    at the moment it' not done, just shows the data view. This would fix the massive annoyance that the current selectedPost feature is
     since you won't be sent to a sole post' detail view **/
    .state(
        {
            name: 'list.detail',
            url: '/posts/:postId',
            controller: require('./views/post-views.controller.js'),
            template: require('./views/main.html'),
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
            name: 'postDetail',
            url: '/posts/:postId',
            controller: require('./detail/post-detail.controller.js'),
            template: require('./detail/detail.html'),
            resolve: {
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
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
    )
    .state(
        {
            url: '/collections/:id/:view',
            name: 'collection',
            controller: require('./collections/collections-controller.js'),
            template: require('./collections/collections.html'),
            resolve: {
                collection: ['$transition$', 'CollectionEndpoint', function ($transition$, CollectionEndpoint) {
                    return CollectionEndpoint.get({collectionId: $transition$.params().id}).$promise;
                }]
            }
        }
    )
    .state(
        {
            name: 'collectionDeprecated',
            url: '/collections/:id/list',
            redirectTo: '/collections/:id/data'
        }
    )
    .state({name: 'savedsearchDeprecated', url: '/savedsearches/:id/list', redirectTo: '/savedsearches/:id/data' })
    .state(
        {
            name: 'savedsearch', url: '/savedsearches/:id/:view',
            controller: require('./savedsearches/savedsearches-controller.js'),
            template: require('./savedsearches/savedsearches.html'),
            resolve: {
                savedSearch: ['$transition$', 'SavedSearchEndpoint', function ($transition$, SavedSearchEndpoint) {
                    return SavedSearchEndpoint.get({id: $transition$.params().id}).$promise;
                }]
            }
        }
    );

}];
