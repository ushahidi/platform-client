module.exports = [
    '$stateProvider',
    function (
        $stateProvider
    ) {

    $stateProvider
    .state(
        {
            url: '^/collections/:id',
            name: 'collectionRedirector',
            params: {
                id: null
            },
            onEnter: function ($state, collection) {
                var viewParam = collection.view;
                if (viewParam === 'list' || viewParam === 'data') {
                    $state.go('collectionData', {id: collection.id});
                } else {
                    $state.go('collectionMap', {id: collection.id});
                }
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
            name: 'collection',
            controller: require('./../views/post-views.controller.js'),
            template: require('./../views/main.html'),
            resolve: {
                isLoading: function () {
                    return {state: true};
                }
            }
        }
    )
    .state(
        {
            name: 'collection.all',
            params: {
                id: null,
                view: {squash: true, value: 'data'}
            },
            views: {
                collectionsAll: {
                    controller: require('./collections-controller.js'),
                    template: require('./collections.html')
                }
            },
            resolve: {
                isLoading: function () {
                    return {state: true};
                },
                collection: ['$transition$', 'CollectionEndpoint', function ($transition$, CollectionEndpoint) {
                    return CollectionEndpoint.get({collectionId: $transition$.params().id}).$promise;
                }]
            }
        }
    )
    .state(
        {
            url: '^/collections/:id/data',
            name: 'collection.all.data',
            views: {
                collectionData: {
                    controller: require('./../views/post-view-data.controller.js'),
                    template: require('./../views/post-view-data.html')
                }
            },
            params: {
                view: {value: 'data', squash: true}
            }
        }
    )
    .state(
        {
            url: '^/collections/:id/map',
            name: 'collection.all.map',
            params: {
                id: null,
                view: {squash: true, value: 'map'}
            },
            views: {
                collectionData: {
                    controller: require('./../views/post-view-map.controller.js'),
                    template: function ($state, $transition$) {
                        return '<post-view-map></post-view-map>';
                    }
                }
            }
        }
    );
}];
