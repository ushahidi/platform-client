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
        validateVideoUrl: function (url) {
            // NOTE: It is very important to pay special attention to the santization needs of this regex if it is changed.
            // It is important that it does not allow subdomains other than player or www in order to ensure that a malicious user
            // can not exploit this field to insert malicious content in an iframe
            var match = url
                .toString()
                .match(
                    /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
                );
            if (match) {
                if (
                    match[3].indexOf('youtu') > -1 ||
                    match[3].indexOf('vimeo') > -1
                ) {
                    return match;
                } else {
                    return null;
                }
            } else {
                return null;
            }
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

            if (!post.form) {
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
                    if (attribute.type !== 'title' && attribute.type !== 'description') {
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
                    }
                });
            });
            return isPostValid;
        }
    };

    return Util.bindAllFunctionsToSelf(PostEditService);
}];
