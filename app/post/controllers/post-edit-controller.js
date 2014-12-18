module.exports = [
    '$scope',
    '$translate',
    '$location',
    '$routeParams',
    'PostEndpoint',
    'FormEndpoint',
    'FormAttributeEndpoint',
function(
    $scope,
    $translate,
    $location,
    $routeParams,
    PostEndpoint,
    FormEndpoint,
    FormAttributeEndpoint
) {
    $translate('post.edit_post').then(function(title){
        $scope.title = title;
    });

    // Activate editing mode
    $scope.is_edit = true;

    PostEndpoint.get({id: $routeParams.id}).$promise.then(function(post) {
        $scope.post = post;
        $scope.active_form = FormEndpoint.get({formId: post.form.id});
        $scope.attributes = FormAttributeEndpoint.query();
    });

    $scope.filterInForm = function(attr) {
        if (!attr.forms[$scope.post.form.id]) {
            return false;
        }
        return true;
    };

    $scope.goBack = function() {
        $location.path('/posts/' + $scope.post.id);
    };

    $scope.savePost = function(post) {
        $scope.saving_post = true;
        var response = PostEndpoint.update(post, function () {
            if (response.errors){
                // Handle errors
                console.log(response);
            }

            $scope.goBack();
        });
    };

    $scope.isDate = function(attr) {
        return attr.input === 'date';
    };
    $scope.isLocation = function(attr) {
        return attr.input === 'location';
    };
    $scope.isSelect = function(attr) {
        return attr.input === 'select';
    };
    $scope.isText = function(attr) {
        return attr.input === 'text';
    };
    $scope.isTextarea = function(attr) {
        return attr.input === 'textarea';
    };

    // leaflet map or location attribute
    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        },

        center: {
            lat: 36.079868,
            lng: -79.819416,
            zoom: 4
        },

        markers: {
            osloMarker: {
                lat: 36.079868,
                lng: -79.819416,
                message: 'Greensboro, NC',
                focus: true,
                draggable: false
            }
        }
    });

    // add/remove links
    $scope.links = [];

    $scope.addLink = function () {
        $scope.links.push({});
    };

    // remove current link row
    $scope.removeLink = function(link) {
        var currentIndex = $scope.links.indexOf(link);
        $scope.links.splice(currentIndex, 1);
    };

}];
