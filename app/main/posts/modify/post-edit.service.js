module.exports = [
    '_',
    'Util',
    '$translate',
    'Notify',
function (
    _,
    Util,
    $translate,
    Notify
) {
    var PostEditService = {
        cleanPostValues: function (post) {
            _.each(post.values, function (value, key) {
                // Strip out empty values
                post.values[key] = _.filter(value);
                // Remove entirely if no values are left
                if (!post.values[key].length) {
                    delete post.values[key];
                }
            });
            return post;
        },
        validatePost: function (post, form, tasks) {
            // First get tasks to be validated
            // The post task is always validated
            // Other tasks are only validated if marked completed

            var isPostValid = true;
            var tasks_to_validate = [];

            _.each(tasks, function (task) {
                if (task.type === 'post' || _.contains(post.completed_stages, task.id)) {
                    tasks_to_validate.push(task);
                }
            });

            // Validate Post default fields
            if (!form) {
                return false;
            }

            if (form.title.$invalid) {
                return false;
            }

            if (!form.content || form.content.$invalid) {
                return false;
            }

            // Validate required fields for each task that needs to be validated
            _.each(tasks_to_validate, function (task) {
                var required_attributes = _.where(task.attributes, {required: true});

                _.each(required_attributes, function (attribute) {
                    if (attribute.input === 'checkbox') {
                        var checkboxValidity = false;
                        _.each(attribute.options, function (option) {
                            if (!_.isUndefined(form['values_' + attribute.id + '_' + option]) && !form['values_' + attribute.id + '_' + option].$invalid) {
                                checkboxValidity = isPostValid;
                            }
                        });
                        isPostValid = checkboxValidity;
                    } else {

                        if (_.isUndefined(form['values_' + attribute.id]) || form['values_' + attribute.id].$invalid) {
                            if (!_.isUndefined(form['values_' + attribute.id])) {
                                form['values_' + attribute.id].$dirty = true;
                            }

                            isPostValid = false;
                        }
                    }
                });
            });
            return isPostValid;
        }
    };

    return Util.bindAllFunctionsToSelf(PostEditService);
}];
