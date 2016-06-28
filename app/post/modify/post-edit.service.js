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
        canSavePost: function (post, form, stages, attributes) {
            var valid = true;
            var errors = [];
            if (post.status === 'published') {
                // first check if stages required have been marked complete
                var requiredStages = _.where(stages, {required: true}) ;

                valid = _.reduce(requiredStages, function (isValid, stage) {
                    // if this stage isn't complete, add to errors
                    if (_.indexOf(post.completed_stages, stage.id) === -1) {
                        errors.push($translate.instant('post.modify.incomplete_step', { stage: stage.label }));
                        return false;
                    }
                    return isValid;
                }, valid);

                if (errors.length) {
                    Notify.errorsPretranslated(errors);
                    return valid;
                }

                valid = _.reduce(post.completed_stages, function (isValid, stageId) {
                    return PostEditService.isStageValid(stageId, form, stages, attributes) && isValid;
                }, valid);
            }

            return valid;
        },
        isFirstStage: function (stages, stageId) {
            if (!_.isEmpty(stages)) {
                return stageId === stages[0].id;
            }
            return false;
        },
        isStageValid: function (stageId, form, stages, attributes) {
            if (PostEditService.isFirstStage(stages, stageId)) {

                // The first stage is assumed to contain the title, content, and the tags
                //  - these are not stored in attributes and do not have a 'required' field
                //   thus, if any of these are invalid, the first stage is not ready to complete

                // Return if form isn't initialized yet
                if (!form) {
                    return false;
                }

                if (form.title.$invalid) {
                    return false;
                }

                if (!form.content || form.content.$invalid) {
                    return false;
                }

                if (form.tags && form.tags.$invalid) {
                    return false;
                }
            }
            // now checking all other post attributes that are required
            return _.chain(attributes)
            .where({form_stage_id : stageId, required: true})
            .reduce(function (isValid, attr) {
                // checkbox validity needs to be handled differently
                // because it has multiple inputs identified via the options
                if (attr.input === 'checkbox') {
                    var checkboxValidity = false;
                    _.each(attr.options, function (option) {
                        if (!_.isUndefined(form['values_' + attr.id + '_' + option]) && !form['values_' + attr.id + '_' + option].$invalid) {
                            checkboxValidity = isValid;
                        }
                    });
                    return checkboxValidity;
                } else {
                    if (_.isUndefined(form['values_' + attr.id]) || form['values_' + attr.id].$invalid) {
                        return false;
                    }
                    return isValid;
                }
            }, true)
            .value();
        }
    };

    return Util.bindAllFunctionsToSelf(PostEditService);
}];
