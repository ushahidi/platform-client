module.exports = PostSurveyService;

PostSurveyService.$inject = [
    'Util',
    'FormEndpoint',
    '$rootScope',
    '$q',
    '_'
];

function PostSurveyService(
    Util,
    FormEndpoint,
    $rootScope,
    $q,
    _
) {
    var PostSurveyService = {
        allowedSurveys : allowedSurveys,
        canCreatePostInSurvey : canCreatePostInSurvey
    };

    function canCreatePostInSurvey(form) {
        // If the form isn't loaded yet, we definitely can't add to it
        if (!form) {
            return false;
        }

        if ($rootScope.hasPermission('Manage Posts')) {
            return true;
        }

        // if everyone_can_create, include the form
        if (form.everyone_can_create) {
            return true;
        }
        // Otherwise, continue to check if the user has access

        // If we're not logged in, we have no role so we definitely don't have access
        if ($rootScope.currentUser === null) {
            return false;
        }

        // Finally, if we are logged in, check if our role is in the list
        if (_.contains(form.can_create, $rootScope.currentUser.role)) {
            return true;
        }

        return false;
    }

    function allowedSurveys() {
        var allowed_forms = $q.defer();

        FormEndpoint.queryFresh()
        .$promise
        .then(function (forms) {
            if ($rootScope.hasPermission('Manage Posts')) {
                allowed_forms.resolve(forms);
            } else {
                allowed_forms.resolve(_.filter(forms, canCreatePostInSurvey));
            }
        });

        return allowed_forms.promise;
    }

    return Util.bindAllFunctionsToSelf(PostSurveyService);
}
