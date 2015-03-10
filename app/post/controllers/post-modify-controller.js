module.exports = [
    '$scope',
    '$translate',
    '$location',
    'PostEntity',
    'PostEndpoint',
    'TagEndpoint',
    'FormEndpoint',
    'FormAttributeEndpoint',
    'Notify',
    '_',
function(
    $scope,
    $translate,
    $location,
    postEntity,
    PostEndpoint,
    TagEndpoint,
    FormEndpoint,
    FormAttributeEndpoint,
    Notify,
    _
) {
    $scope.categories = TagEndpoint.query();

    this.fetchAttributes = function(form_id) {
        FormAttributeEndpoint.query({formId: form_id}).$promise.then(function(attrs) {
            // Initialize values on post (helps avoid madness in the template)
            attrs.map(function (attr) {
                if (! $scope.post.values[attr.key]) {
                    $scope.post.values[attr.key] = [null];
                }
            });
            $scope.attributes = attrs;
        });
    };

    $scope.allowedChangeStatus = function() {
        return $scope.post_options.$resolved && $scope.post_options.allowed_privileges.indexOf('change_status') !== -1;
    };

    $scope.publishPost = function(post) {
        $scope.post.status = 'published';
    };

    $scope.unpublishPost = function(post) {
        $scope.post.status = 'draft';
    };

    $scope.savePost = function(post) {
        $scope.saving_post = true;

        // Avoid messing with original object
        post = _.clone(post);
        post.values = _.clone(post.values);

        // Clean up post values object
        _.each(post.values, function (value, key) {
            // Strip out empty values
            post.values[key] = _.filter(value);
            // Remove entirely if no values are left
            if (! post.values[key].length) {
                delete post.values[key];
            }
        });

        var request;
        if (post.id) {
            request = PostEndpoint.update(post);
        } else {
            request = PostEndpoint.save(post);
        }

        request.$promise.then(function (response) {
            // @todo check allowed_methods instead
            if (response.id && response.status === 'published') {
                $location.path('/posts/' + response.id);
            }
            else {
                Notify.showSingleAlert('Saved!');
                $location.path('/');
            }
        }, function(errorResponse) { // errors

            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
            $scope.saving_post = false;
        });
    };

    $scope.isDate = function(attr) {
        return attr.input === 'date';
    };
    $scope.isDateTime = function(attr) {
        return attr.input === 'datetime';
    };
    $scope.isLocation = function(attr) {
        return attr.input === 'location';
    };
    $scope.isSelect = function(attr) {
        return attr.input === 'select';
    };
    $scope.isNumber = function(attr) {
        return attr.input === 'number';
    };
    $scope.isText = function(attr) {
        return attr.input === 'text';
    };
    $scope.isTextarea = function(attr) {
        return attr.input === 'textarea';
    };
    $scope.isCheckbox = function(attr) {
        return attr.input === 'checkbox';
    };
    $scope.isRadio = function(attr) {
        return attr.input === 'radio';
    };

    // Can more values be added for this attribute?
    $scope.canAddValue = function(attr) {
        return (
            // Attribute allows unlimited values
            attr.cardinality === 0 ||
            // Less values than cardinality allows
            $scope.post.values[attr.key].length < attr.cardinality
        );
    };
    // Can this values be removed?
    $scope.canRemoveValue = function(attr, key) {
        return $scope.post.values[attr.key].length > 1;
    };
    // Add a new value
    $scope.addValue = function (attr) {
        $scope.post.values[attr.key].push(null);
    };
    // Remove a value
    $scope.removeValue = function (attr, key) {
        $scope.post.values[attr.key].splice(key, 1);
    };

    // Datepicker
    $scope.datepicker = [];

    $scope.openDatePicker = function($event, attribute, key) {
        $event.preventDefault();
        $event.stopPropagation();

        if (! $scope.datepicker[attribute.key]) {
            $scope.datepicker[attribute.key] = [];
        }
        $scope.datepicker[attribute.key][key] = true;
    };

}];
