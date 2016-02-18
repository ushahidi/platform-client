module.exports = [
    '_',
    '$q',
    '$translate',
    'FormEndpoint',
    'FormAttributeEndpoint',
    'DataImportEndpoint',
    'Util',
function (
    _,
    $q,
    $translate,
    FormEndpoint,
    FormAttributeEndpoint,
    DataImportEndpoint,
    Util
) {

    var DataRetriever = {
        dataMapperInitialData: function (formId, csvId) {
            return $q.all([
                FormEndpoint.get({id: formId}).$promise,
                FormAttributeEndpoint.query({ formId: formId }).$promise,
                DataImportEndpoint.get({id: csvId}).$promise
            ]).then(function (results) {
                var form = results[0];
                form.attributes = _.chain(results[1])
                    .sortBy('priority')
                    .value();

                // Add in the Post specific mappable fields
                form.attributes.push(
                    {
                        'key': 'title',
                        'label': $translate.instant('post.modify.form.title')
                    },
                    {
                        'key': 'content',
                        'label': $translate.instant('post.modify.form.description')
                    }
                );
                var csv = results[2];
                csv.maps_to = Util.autoMap(
                                         csv.columns,
                                         form.attributes,
                                         csv.columns.length
                                     );
                return {
                    form: form,
                    csv: csv
                };
            });
        }
    };

    return Util.bindAllFunctionsToSelf(DataRetriever);
}];
