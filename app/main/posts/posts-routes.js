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
    /** @uirouter-refactor add this back to state
     *  .when('/collections/:id/list', { redirectTo: '/collections/:id/data' })
    **
    .when('/collections/:id/:view?', {
        controller: require('./collections/collections-controller.js'),
        template: require('./collections/collections.html'),
        resolve: {
            collection: ['$route', 'CollectionEndpoint', function ($route, CollectionEndpoint) {

                return CollectionEndpoint.get({collectionId: $route.current.params.id}).$promise;
            }]
        }
    })
    .when('/savedsearches/:id/list', { redirectTo: '/savedsearches/:id/data' })

    .when('/savedsearches/:id/:view?', {
        controller: require('./savedsearches/savedsearches-controller.js'),
        template: require('./savedsearches/savedsearches.html'),
        resolve: {
            savedSearch: ['$route', 'SavedSearchEndpoint', function ($route, SavedSearchEndpoint) {
                return SavedSearchEndpoint.get({id: $route.current.params.id}).$promise;
            }]
        }
    })

     **/

    /** @uirouter-refactor add this back to state
     *  .when('/collections/:id/list', { redirectTo: '/collections/:id/data' })
     **/
    ;
}];
