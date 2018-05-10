module.exports = HxlExport;

HxlExport.$inject = ['$rootScope', 'HxlTagEndpoint', 'FormEndpoint', 'FormAttributeEndpoint', '_'];

function HxlExport($rootScope, HxlTagEndpoint, FormEndpoint, FormAttributeEndpoint, _) {

    function getFormsWithTags() {
        return getTags();
    }

    function getTags() {
        return HxlTagEndpoint.get().$promise.then((tags)=> {
            return getForms(tags.results);
        });
    }

    function getForms(tags) {
        //  requesting forms
        return FormEndpoint.queryFresh({targeted_survey: false}).$promise.then(function (response) {
            return attachAttributes(response, tags);
        });
    }

    function attachAttributes(forms, tags) {
        // requesting attributes and attaches them to the correct form
        return _.each(forms, function (form) {
            return FormAttributeEndpoint.query({formId: form.id}).$promise.then(function (response) {
                form.attributes = response;
                return attachTagsToAttributes(form, tags);
            });
        });
    }

    function attachTagsToAttributes(form, tags) {
        // attaching hxl-tags to each attribute
        _.each(form.attributes, (attribute) => {
            attribute.tags = [];
            _.each(tags, (tag) => {
                if (tag.form_attribute_types.indexOf(attribute.type) > -1) {
                    attribute.tags.push(tag);
                }
            });
        });
        return form;
    }
    return { getFormsWithTags };
}
