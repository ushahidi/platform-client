module.exports = [
    '$scope',
    '$rootScope',
    'Features',
    '$location',
    'HxlExport',
    'DataExport',
    '_',
    'LoadingProgress',
    'Notify',
function (
    $scope,
    $rootScope,
    Features,
    $location,
    HxlExport,
    DataExport,
    _,
    LoadingProgress,
    Notify
) {
    $scope.selectHxlAttribute = selectHxlAttribute;
    $scope.addAnother = addAnother;
    $scope.range = range;
    $scope.selectTag = selectTag;
    $scope.exportData = exportData;
    $scope.selectAll = selectAll;
    $scope.isLoading = LoadingProgress.getLoadingState;
    $scope.getSelectedFields = getSelectedFields;
    $scope.hxlAttributeSelected = hxlAttributeSelected;

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    // Check if hxl-feature is enabled
    Features.loadFeatures().then(function () {
        $scope.hxlEnabled = Features.isFeatureEnabled('hxl');
        // Redirect to home if not enabled
        if (!$scope.hxlEnabled) {
            return $location.path('/');
        }
    });

    activate();

    function activate() {
        HxlExport.getFormsWithTags().then((formsWithTags)=> {
            $scope.forms = formsWithTags;
        });
    }

    function range(attribute) {
        if (!attribute.nbAttributes) {
            attribute.nbAttributes = 1;
        }
        return _.range(attribute.nbAttributes);
    }

    function addAnother(attribute) {
        attribute.nbAttributes++;
    }

    function hxlAttributeSelected(hxlAttribute, formAttribute, index) {
        let disabled = false;
        // hack to not disable the value in the current dropdown
        let selectedHxlAttributes = angular.copy(formAttribute.selectedHxlAttributes);
        delete selectedHxlAttributes[index];
        if (_.findWhere(selectedHxlAttributes, {id: hxlAttribute.id})) {
            disabled = true;
        }
        return disabled;
    }

    function selectAll(form) {
        if (form.selected) {
            form.attributes = _.map(form.attributes, (attribute) => {
                attribute.selected = [attribute.id];
                return attribute;

            });
        } else {
            form.attributes = _.map(form.attributes, (attribute) => {
                attribute.selected = [];
                return attribute;
            });
        }
    }

    function getSelectedFields() {
        let selectedFields = [];
        _.each($scope.forms, (form) => {
            _.each(form.attributes, (attribute) => {
                if (attribute.selected && attribute.selected.length > 0) {
                    selectedFields.push(attribute.id);
                }
            });
        });
        return selectedFields;
    }

    function selectTag(attribute) {
        if (attribute.selectedTag && attribute.selectedTag.tag_name) {
            attribute.pretty = '#' + attribute.selectedTag.tag_name;
        } else {
            attribute.pretty = '';
        }
        attribute.nbAttributes = 1;
        attribute.selectedHxlAttributes = {};
    }

    function selectHxlAttribute(attribute) {
        attribute.pretty = '#' + attribute.selectedTag.tag_name;
        _.each(attribute.selectedHxlAttributes, (hxl_attribute) => {
            if (hxl_attribute !== '') {
                attribute.pretty = attribute.pretty + '+' + hxl_attribute.attribute;
            }
        });
    }

    function formatIds() {
        let hxlData = [];
        _.each($scope.forms, (form) => {
            _.each(form.attributes, (formAttribute) => {
                if (formAttribute.selected && formAttribute.selected.length > 0) {
                    // checking if there is a tag selected. If not, there will be no hxl-attributes selected either
                    let obj = formAttribute.selectedTag ? {form_attribute_id: formAttribute.id, hxl_tag_id: formAttribute.selectedTag.id} : {form_attribute_id: formAttribute.id};
                    if (formAttribute.selectedHxlAttributes && !_.isEmpty(formAttribute.selectedHxlAttributes)) {
                        _.each(formAttribute.selectedHxlAttributes, (hxlAttribute) => {
                            let objWithAttr = angular.copy(obj);
                            objWithAttr.hxl_attribute_id = parseInt(hxlAttribute.id);
                            hxlData.push(objWithAttr);
                        });
                    } else {
                        hxlData.push(obj);
                    }
                }
            });
        });
        return hxlData;
    }

    function exportData(sendToHDX) {
        if (formatIds().length === 0) {
            // displaying notification if no fields are selected
            var message =  '<p translate="data_export.no_fields"></p>';
            Notify.notifyAction(message, null, false, 'warning', 'error');
        } else {
            let title, description, button, cancel;
            let data = {
                'fields': $scope.getSelectedFields(),
                'filters':
                {
                    'status' : ['published','draft'],
                    'has_location' : 'all',
                    'orderby' : 'created',
                    'order' : 'desc',
                    'order_unlocked_on_top' : 'true',
                    'source' : ['sms','twitter','web','email']
                },
                'send_to_hdx': sendToHDX,
                'include_hxl': sendToHDX,
                'send_to_browser': !sendToHDX,
                'hxl_heading_row': formatIds()
            };

            if (sendToHDX) {
                title = 'data_export.upload_title';
                description = 'data_export.upload_desc';
                button = 'data_export.upload_button';
            } else {
                title = 'data_export.hdx_csv_title';
                description = 'data_export.hdx_csv_desc';
                button = 'data_export.export_button';
            }

            cancel = 'data_export.go_back';

            Notify.confirmModal(title, null, description, `{fields: ${getSelectedFields().length}}`, button, cancel).then(() => {
                DataExport.startExport(data);
            });
        }
    }
}];
