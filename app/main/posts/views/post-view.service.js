module.exports = [
    '_',
    'Util',
    '$translate',
    '$rootScope',
    'SliderService',
function (
    _,
    Util,
    $translate,
    $rootScope,
    SliderService
) {
    var scope;

    var PostViewService = {
        showNoPostsSlider: function () {
            var scope = getScope();
            // TODO review translation sanitization
            $translate(['post.there_are_no_posts', 'post.in_this_deployment']).then(function (noPostText) {
                scope.noPostText = noPostText;
                SliderService.openTemplate(
                    '<p><strong>{{noPostText["post.there_are_no_posts"]}}</strong>{{noPostText["post.in_this_deployment"]}}</p>' +
                    '<add-post-text-button></add-post-text-button>' +
                    '<button role="button" class="button-flat message-trigger" ng-click="close()">Dismiss</button>',
                'file', false, scope, false, false, true);
            });

        }
    };

    function getScope() {
        if (scope) {
            scope.$destroy();
        }
        scope = $rootScope.$new();
        return scope;
    }

    return Util.bindAllFunctionsToSelf(PostViewService);
}];
