module.exports = PostViewData;

PostViewData.$inject = [];
function PostViewData() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '=',
            currentView: '='
        },
        controller: PostViewDataController,
        template: require('./post-view-data.html')
    };
}

PostViewDataController.$inject = [
'$scope',
'$rootScope',
'PostFilters',
'_',
'PostEndpoint',
'PostViewService',
'moment',
'$translate',
'Notify'
];

function PostViewDataController(
    $scope,
    $rootScope,
    PostFilters,
    _,
    PostEndpoint,
    PostViewService,
    moment,
    $translate,
    Notify
) {
    $scope.currentPage = 1;
    $scope.selectedPosts = [];
    $scope.itemsPerPageOptions = [10, 20, 50];
    $scope.itemsPerPage = $scope.itemsPerPageOptions[1];
    // until we have the correct total_count value from backend request:
    $scope.totalItems = $scope.itemsPerPage;
    $scope.posts = [];
    $scope.groupedPosts = {};
    $scope.showPost = showPost;
    $scope.loadMore = loadMore;
    $scope.editMode = {editing: false};

    if (PostFilters.getMode() !== 'collection' && PostFilters.getMode() !== 'savedsearch') {
        $rootScope.setLayout('layout-d');
    }

    activate();
    function activate() {
        getPosts();
        // whenever the reactiveFilters var changes, do a dummy update of $scope.filters.reactiveFilters
        // to force the $scope.filters watcher to run
        $scope.$watch(function () {
            return PostFilters.reactiveFilters;
        }, function () {
            if (PostFilters.reactiveFilters === 'enabled') {
                $scope.filters.reactToFilters = $scope.filters.reactToFilters ? !$scope.filters.reactToFilters : true;
            }
        }, true);
        /** whenever the filters changes, update the current list of posts **/
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            if (PostFilters.reactiveFilters === 'enabled' && (newValue !== oldValue)) {
                $scope.clearPosts = true;
                getPosts();
                PostFilters.reactiveFilters = 'disabled';
            }
        }, true);
    }

    function showPost(post) {
        // displaying warning if user is in editmode when trying to change post
        if ($scope.editMode.editing) {
            Notify.confirmLeave('notify.post.leave_without_save').then(function () {
                $scope.editMode.editing = false;
                $scope.selectedPost = {post: post};
                $scope.selectedPostId = post.id;
            });
        } else if (post.id !== $scope.selectedPostId) {
            $scope.selectedPost = {post: post};
            $scope.selectedPostId = post.id;
        } else {
            $scope.selectedPost = {post: null};
            $scope.selectedPostId = null;
        }
    }

    function getPosts(query) {
        query = query || PostFilters.getQueryParams($scope.filters);
        PostEndpoint.stats(query).$promise.then(function (results) {
            $scope.total = results.totals[0].values[0].total;
        });
        var postQuery = _.extend({}, query, {
            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
            limit: $scope.itemsPerPage
        });
        PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
            //Clear posts
            $scope.clearPosts ? resetPosts() : null;
            // Add posts to full set of posts
            // @todo figure out if we can store these more efficiently
            Array.prototype.push.apply($scope.posts, postsResponse.results);

            // Merge grouped posts into existing groups
            angular.forEach(groupPosts(postsResponse.results), function (posts, group) {
                if (angular.isArray($scope.groupedPosts[group])) {
                    Array.prototype.push.apply($scope.groupedPosts[group], posts);
                } else {
                    $scope.groupedPosts[group] = posts;
                }
            });
            $scope.totalItems = postsResponse.total_count;
            $scope.isLoading.state = false;
            if ($scope.posts.count === 0 && !PostFilters.hasFilters($scope.filters)) {
                PostViewService.showNoPostsSlider();
            }
        });
    }

    function groupPosts(posts) {
        var now = moment(),
            yesterday = moment().subtract(1, 'days');

        return _.groupBy(posts, function (post) {
            var postDate = moment(post.post_date);
            if (now.isSame(postDate, 'd')) {
                return $translate.instant('nav.today');
            } else if (yesterday.isSame(postDate, 'd')) {
                return $translate.instant('nav.yesterday');
            } else {
                return postDate.fromNow();
            }
        });
    }

    function resetPosts() {
        $scope.posts = [];
        $scope.groupedPosts = {};
        $scope.totalItems = $scope.itemsPerPage;
        $scope.currentPage = 1;
        $scope.selectedPosts = [];
    }

    function loadMore() {
        // Increment page
        $scope.currentPage++;
        $scope.clearPosts = false;
        getPosts();
    }
}
