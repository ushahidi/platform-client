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
'$timeout',
'$location',
'$anchorScroll',
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
    $timeout,
    $location,
    $anchorScroll,
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
    $scope.newPostsCount = 0;
    $scope.recentPosts = [];
    $scope.addNewestPosts = addNewestPosts;
    $scope.editMode = {editing: false};

    $rootScope.setLayout('layout-d');

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
        checkForNewPosts(30000);
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
            groupPosts(postsResponse.results);

            $scope.totalItems = postsResponse.total_count;
            $scope.isLoading.state = false;
            if ($scope.posts.count === 0 && !PostFilters.hasFilters($scope.filters)) {
                PostViewService.showNoPostsSlider();
            }
        });
    }

    function createPostGroups(posts) {
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

    function groupPosts(postList) {
        angular.forEach(createPostGroups(postList), function (posts, group) {
            if (angular.isArray($scope.groupedPosts[group])) {
                Array.prototype.unshift.apply($scope.groupedPosts[group], posts);
            } else {
                $scope.groupedPosts[group] = posts;
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

    function getNewPosts() {
        var existingFilters = PostFilters.getQueryParams($scope.filters);
        var filterDate = moment(existingFilters.date_before).format('MMM Do YY');
        var now = moment().format('MMM Do YY');
        if (filterDate >= now) {
            var mostRecentPostDate = $scope.recentPosts[0] ? $scope.recentPosts[0].post_date : $scope.posts[0].post_date;
            existingFilters.date_after = mostRecentPostDate;
            var query = existingFilters;
            var postQuery = _.extend({}, query, {
                order: $scope.filters.order,
                orderby: $scope.filters.orderby
            });
            PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                Array.prototype.unshift.apply($scope.recentPosts, postsResponse.results);
                $scope.newPostsCount += postsResponse.count;
            });
        }
    }

    function addNewestPosts() {
        Array.prototype.unshift.apply($scope.posts, $scope.recentPosts);
        groupPosts($scope.recentPosts);
        $scope.totalItems = $scope.totalItems + $scope.newPostsCount;
        $scope.recentPosts = [];
        $scope.newPostsCount = 0;
        $location.hash('post-data-view-top');
        $anchorScroll();
    }

    function checkForNewPosts(time) {
        if ($scope.posts.length) {
            getNewPosts();
        }
        $timeout(checkForNewPosts, time, true, time);
    }
}
