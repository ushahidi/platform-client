module.exports = [
    '$stateProvider',
    function (
        $stateProvider
    ) {

    $stateProvider
    .state(
        {
            url: '^/savedsearches/:id',
            name: 'savedsearchesRedirector',
            params: {
                id: null
            },
            onEnter: function ($state, savedSearch) {
                var viewParam = savedSearch.view;
                if (viewParam === 'list' || viewParam === 'data') {
                    $state.go('savedsearches.all.data', {id: savedSearch.id});
                } else {
                    $state.go('savedsearches.all.map', {id: savedSearch.id});
                }
            },
            resolve: {
                savedSearch: ['$transition$', 'SavedSearchEndpoint', function ($transition$, SavedSearchEndpoint) {
                    return SavedSearchEndpoint.get({id: $transition$.params().id}).$promise;
                }]
            }
        }
    )
    .state(
        {
            name: 'savedsearches',
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
            name: 'savedsearches.all',
            params: {
                id: null,
                view: {squash: true, value: 'data'}
            },
            views: {
                savedsearchesAll: {
                    controller: require('./savedsearches-controller.js'),
                    template: require('./savedsearches.html')
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
            name: 'savedsearches.all.data',
            views: {
                savedsearchesData: {
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
            url: '^/savedsearches/:id/map',
            name: 'savedsearches.all.map',
            params: {
                id: null,
                view: {squash: true, value: 'map'}
            },
            views: {
                savedsearchesData: {
                    controller: require('./../views/post-view-map.controller.js'),
                    template: function ($state, $transition$) {
                        return '<post-view-map></post-view-map>';
                    }
                }
            }
        }
    );
}];
