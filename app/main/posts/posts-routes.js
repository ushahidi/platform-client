module.exports = [
    '$stateProvider',
function (
    $stateProvider
) {

    $stateProvider
    .state({name: 'list.deprecated', url: '/views/list', redirectTo: '/views/data'})
    .state(
        {
            name: 'list',
            url: '/views/:view',
            controller: require('./views/post-views.controller.js'),
            template: require('./views/main.html'),
            onEnter: function ($state, $transition$) {
                var view = $transition$.params().view ? $transition$.params().view : 'map';
                console.log($transition$.params().view);
                if (view === 'list') {
                    $state.go('list', {view: 'data'}, {reload: true});
                }
                //$state.go('list', {view: view});
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
            params: {
                id: null,
                view: {squash: true, value: null}
            },
            controller: require('./collections/collections-controller.js'),
            template: require('./collections/collections.html'),
            onEnter: function ($state, $transition$, collection) {
                var view = collection.view;
                if (view === 'list') {
                    view = 'data';
                } else if (!view) {
                    view = 'map';
                } else if ($transition$.params().view && $transition$.params().view !== 'list') {
                    view = $transition$.params().view;
                }
                $state.go('collection', {view: view, id: $transition$.params().id});
            },
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
    .state(
        {
            name: 'savedsearch',
            url: '/savedsearches/:id/:view',
            params: {
                id: null,
                view: {squash: true, value: null}
            },
            controller: require('./savedsearches/savedsearches-controller.js'),
            template: require('./savedsearches/savedsearches.html'),
            onEnter: function ($state, $transition$, savedSearch) {
                var view = savedSearch.view;
                if (view === 'list') {
                    view = 'data';
                } else if (!view) {
                    view = 'map';
                } else if ($transition$.params().view && $transition$.params().view !== 'list') {
                    view = $transition$.params().view;
                }
                $state.go('savedsearch', {view: view, id: $transition$.params().id});
            },
            resolve: {
                savedSearch: ['$transition$', 'SavedSearchEndpoint', function ($transition$, SavedSearchEndpoint) {
                    return SavedSearchEndpoint.get({id: $transition$.params().id}).$promise;
                }]
            }
        }
    );

}];
