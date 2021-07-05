module.exports = [
    '$scope',
    '$rootScope',
    'Features',
    '$state',
    'HxlExport',
    '_',
    'LoadingProgress',
    '$anchorScroll',
    'Notify',
    'DataExport',
function (
    $scope,
    $rootScope,
    Features,
    $state,
    HxlExport,
    _,
    LoadingProgress,
    $anchorScroll,
    Notify,
    DataExport
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
    $scope.showProgress = false;

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    // Check if hxl-feature is enabled
    Features.loadFeatures().then(function () {
        $scope.hxlEnabled = Features.isFeatureEnabled('hxl');
        // Redirect to home if not enabled
        if (!$scope.hxlEnabled) {
            $state.go('posts.map.all');
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
        if (_.findWhere(selectedHxlAttributes, {attribute: hxlAttribute.attribute})) {
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
                    selectedFields.push(attribute.key);
                }
            });
        });

        if ($scope.fieldError && selectedFields.length > 0) {
            $scope.fieldError = false;
        }
        return selectedFields;
    }

    function selectTag(attribute) {
        attribute.selected = [attribute.id];
        attribute.hxl_label = createHxlLabel(attribute);
        if (!attribute.selectedTag || !attribute.selectedTag.tag_name) {
            addAnother(attribute);
        }

        attribute.selectedHxlAttributes = [];
    }

    function selectHxlAttribute(attribute) {
        if (!needsMatchedAttribute(attribute)) {
            attribute.hxl_label = createHxlLabel(attribute);
        } else {
            attribute = addGeoMatchedAttribute(attribute);
        }
        return attribute;
    }
    function addGeoMatchedAttribute(attribute) {
        const hxl_attribute = attribute.selectedHxlAttributes[attribute.selectedHxlAttributes.length - 1];
        // check if we have lat or lon and assign the correct opposite attribute for it
        const opposite_attribute_str = hxl_attribute.attribute === 'lat' ? 'lon' : 'lat';
        // If the label is not just #geo, it means the action is removing a tag instead of adding one,
        // and we need to clear the label instead of adding to it
        if (attribute.hxl_label[0] !== '#geo') {
            attribute.hxl_label = ['#geo'];
            attribute.selectedHxlAttributes = [];
            attribute.nbAttributes--;
        } else {
            addAnother(attribute);
            attribute.selectedHxlAttributes.push({attribute: opposite_attribute_str });
            attribute.hxl_label = [
                '#geo+lat',
                '#geo+lon'
            ];
        }
        return attribute;
    }

    /**
     * Checks if we need a matched lat/lon attribute.
     * Only applies to #geo tags with a lat/lon attribute selected
     * @param attribute
     * @param ignoreMatch
     * @param needsMatchLatLon
     * @returns {*}
     */
    function needsMatchedAttribute(attribute) {
        if (attribute.selectedTag.tag_name !== 'geo') {
            return false;
        }
        let needs_match = _.filter(attribute.selectedHxlAttributes, (selected) => {
            return selected.attribute === 'lon' || selected.attribute === 'lat';
        }).length;
        return needs_match === 1;
    }

    function createHxlLabel(attribute) {
        if (!attribute.selectedTag) {
            return [];
        }
        let label = '#' + attribute.selectedTag.tag_name;
        _.each(attribute.selectedHxlAttributes, (hxl_attribute) => {
            label = label + '+' + hxl_attribute.attribute;
        });
        return [label];
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
                            let hxlAttr = getHxlAttributeByTagIdAndName(formAttribute, hxlAttribute.attribute);
                            if (hxlAttr) {
                                let objWithAttr = angular.copy(obj);
                                objWithAttr.hxl_attribute_id = parseInt(hxlAttr.id);
                                hxlData.push(objWithAttr);
                            }
                        });
                    } else {
                        hxlData.push(obj);
                    }
                }
            });
        });
        return hxlData;
    }

    function getHxlAttributeByTagIdAndName(formAttribute, hxlAttributeName) {
        const tag = _.findWhere(formAttribute.tags, {id: formAttribute.selectedTag.id});
        return _.findWhere(tag.hxl_attributes, {attribute: hxlAttributeName});
    }

    function exportData(sendToHDX) {
        const formattedIds = formatIds();
        if (formattedIds.length === 0) {
            // scrolling to top and display the error-message
            $scope.fieldError = true;
            $anchorScroll();
        } else {
            $scope.fieldError = false;
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
                'include_hxl': true,
                'send_to_browser': !sendToHDX,
                'hxl_heading_row': formattedIds
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
                    if (sendToHDX) {
                        $state.go('settings.hdxDetails', {exportJob: data });
                    } else {
                        DataExport.startExport(data, sendToHDX).then((id) => {
                            $scope.showProgress = true;
                        });
                    }
                });
        }
    }
}];
