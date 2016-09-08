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
    var importData = {
        data: {}
    };
    var DataRetriever = {
        setImportData: function (data) {
            importData.data = data;
        },
        getImportData: function () {
            return importData.data;
        },
        dataMapperInitialData: function (formId, csvId) {
            return $q.all([
                FormEndpoint.get({id: formId}).$promise,
                FormAttributeEndpoint.query({ formId: formId }).$promise,
                DataImportEndpoint.get({id: csvId}).$promise
            ]).then(function (results) {
                var form = results[0];
                // Split locations into lat/lon
                var points = _.chain(results[1])
                    .where({'type' : 'point'})
                    .reduce(function (collection, item) {
                        return collection.concat(
                            {
                                key: item.key + '.lat',
                                label: item.label + ' (Latitude)',
                                priority: item.priority
                            }, {
                                key: item.key + '.lon',
                                label: item.label + ' (Longitude)',
                                priority: item.priority
                            }
                        );
                    }, [])
                    .value();

                form.attributes = _.chain(results[1])
                    .reject({type : 'point'})
                    .concat(points)
                    // Add in the Post specific mappable fields
                    .push({
                            'key': 'title',
                            'label': $translate.instant('post.modify.form.title'),
                            'priority': 0
                        },
                        {
                            'key': 'content',
                            'label': $translate.instant('post.modify.form.description'),
                            'priority': 1
                        }
                    )
                    .sortBy('priority')
                    .value();

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
