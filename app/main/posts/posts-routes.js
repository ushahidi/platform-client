module.exports = [
    '$stateProvider',
function (
    $stateProvider
) {

    $stateProvider
    .state(
        {
            name: 'list',
            abstract: true,
            controller: require('./views/post-views.controller.js'),
            template: require('./views/main.html'),
            resolve: {
                isLoading: function () {
                    return {state: true};
                }
            }
        }
    )
    .state(
        {
            name: 'list.data',
            url: '/views/data',
            controller: require('./views/post-view-data.controller.js'),
            template: require('./views/post-view-data.html'),
            params: {
                view: {value: 'data', squash: true}
            },
            onEnter: function ($state, $transition$, PostFilters) {
                // switch (PostFilters.getMode()) {
                //     case 'savedsearch':
                //         $state.go('savedsearch', {id: PostFilters.getModeId(), view: $transition$.params().view}, {reload: true});
                //         break;
                //     case 'collection':
                //         $state.go('collection', {id: PostFilters.getModeId(), view: $transition$.params().view}, {reload: true});
                //         break;
                //     default:
                //         var view = $transition$.params().view ? $transition$.params().view : 'map';
                //         if (view === 'list') {
                //             $state.go('list.data', {view: 'data'}, {reload: true});
                //         }
                // }

            }
        }
    )
    .state(
        {
            cache: false,
            name: 'list.map',
            url: '/views/map',
            template: function ($state, $transition$) {
                return '<post-view-map></post-view-map>' +
                    '<div ui-view="collectionSavedSearchMap"></div>';
            },
            params: {
                view: {value: 'map', squash: true}
            },
            onEnter: function ($state, $transition$, PostFilters) {
                switch (PostFilters.getMode()) {
                    case 'savedsearch':
                        $state.go('savedsearch', {id: PostFilters.getModeId(), view: $transition$.params().view}, {reload: true});
                        break;
                    case 'collection':
                        $state.go('collection', {id: PostFilters.getModeId(), view: $transition$.params().view}, {reload: true});
                        break;
                    default:
                        var view = $transition$.params().view ? $transition$.params().view : 'map';
                        if (view === 'list') {
                            $state.go('list', {view: 'data'}, {reload: true});
                        }
                }

            }
        }
    )
    .state(
        {
            url: '^/savedsearches/:id',
            name: 'savedsearches',
            params: {
                id: null
            },
            onEnter: function ($state, savedSearch) {
                var viewParam = savedSearch.view;
                if (viewParam === 'list' || viewParam === 'data') {
                    $state.go('savedsearchesData', {id: savedSearch.id});
                } else {
                    $state.go('savedsearchesMap', {id: savedSearch.id});
                }
            },
            resolve: {
                isLoading: function () {
                    return {state: true};
                },
                savedSearch: ['$transition$', 'SavedSearchEndpoint', function ($transition$, SavedSearchEndpoint) {
                    return SavedSearchEndpoint.get({id: $transition$.params().id}).$promise;
                }]
            }
        }
    )
    .state(
        {
            url: '^/savedsearches/:id/data',
            name: 'savedsearchesData',
            parent: 'list.data',
            params: {
                id: null,
                view: {squash: true, value: 'data'}
            },
            controller: require('./savedsearches/savedsearches-controller.js'),
            template: require('./savedsearches/savedsearches.html'),
            resolve: {
                isLoading: function () {
                    return {state: true};
                },
                savedSearch: ['$transition$', 'SavedSearchEndpoint', function ($transition$, SavedSearchEndpoint) {
                    return SavedSearchEndpoint.get({id: $transition$.params().id}).$promise;
                }]
            }
        }
    )
    .state(
        {
            url: '^/savedsearches/:id/map',
            name: 'savedsearchesMap',
            parent: 'list.map',
            params: {
                id: null,
                view: {squash: true, value: 'map'}
            },
            views: {
                collectionSavedSearchMap: {
                    controller: require('./savedsearches/savedsearches-controller.js'),
                    template: require('./savedsearches/savedsearches.html')
                }
            },
            resolve: {
                isLoading: function () {
                    return {state: true};
                },
                savedSearch: ['$transition$', 'SavedSearchEndpoint', function ($transition$, SavedSearchEndpoint) {
                    return SavedSearchEndpoint.get({id: $transition$.params().id}).$promise;
                }]
            }
        }
    )
    /** @uirouter-refactor this implies that we will find out selected post details from the data view in /views/data/posts/6539
     at the moment it' not done, just shows the data view. This would fix the massive annoyance that the current selectedPost feature is
     since you won't be sent to a sole post' detail view
     **/
    .state(
        {
            name: 'list.data.detail',
            url: '/posts/:postId',
            template: require('./detail/post-detail-data.html'),
            controller: require('./detail/post-detail-data.controller.js'),
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
            },
            onEnter: function ($state, $transition$) {
                console.log($state, $transition$);
            }
        }
    )
    /** @uirouter-refactor this implies that we will find out selected post details from the data view in /views/data/posts/6539
     at the moment it' not done, just shows the data view. This would fix the massive annoyance that the current selectedPost feature is
     since you won't be sent to a sole post' detail view
     **/
    .state(
        {
            name: 'list.data.edit',
            url: '/posts/:postId/edit',
            template: require('./modify/post-data-editor.html'),
            controller: require('./modify/post-data-editor.controller.js'),
            resolve: {
                //change to selectedPost and refactor the selectedposts in general
                post: ['$transition$', 'PostEndpoint', function ($transition$, PostEndpoint) {
                    return PostEndpoint.get({ id: $transition$.params().postId }).$promise;
                }]
            },
            onEnter: function ($state, $transition$) {
                console.log($state, $transition$);
            }
        }
    )
    .state(
        {
            name: 'list.noui',
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
    );

}];
