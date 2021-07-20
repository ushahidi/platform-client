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
            name: 'posts.noui',
            url: '/map/noui',
            controller: require('../map/post-view-noui.controller.js'),
            template: require('../map/post-view-noui.html'),
            params: {
                view: {value: 'noui', squash: true}
            }
        }
    );
}];
