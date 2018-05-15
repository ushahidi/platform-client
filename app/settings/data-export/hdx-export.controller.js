module.exports = [
    '$scope',
    '$rootScope',
    'Features',
    '$location',
    'HxlExport',
    '_',
    'LoadingProgress',
function (
    $scope,
    $rootScope,
    Features,
    $location,
    HxlExport,
    _,
    LoadingProgress
) {
    $scope.selectAttribute = selectHxlAttribute;
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
        let selectedFields = 0;
        _.each($scope.forms, (form) => {
            _.each(form.attributes, (attribute) => {
                if (attribute.selected && attribute.selected.length > 0) {
                    selectedFields++;
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
        let data = [];
        _.each($scope.forms, (form) => {
            _.each(form.attributes, (formAttribute) => {
                if (formAttribute.selected && formAttribute.selected.length > 0) {
                    let ids = {
                            form_attribute_id : formAttribute.id,
                            hxl_tag: null
                        };

                    if (formAttribute.selectedTag) {
                        ids.hxl_tag = {
                            hxl_tag_id: formAttribute.selectedTag.id
                        };

                        if (formAttribute.selectedHxlAttributes) {
                            ids.hxl_tag.hxl_attribute_ids = [];
                            _.each(formAttribute.selectedHxlAttributes, (hxlAttribute) => {
                                ids.hxl_tag.hxl_attribute_ids.push(hxlAttribute.id);
                            });
                        }
                    }
                    data.push(ids);
                }
            });
        });
        return data;
    }

    function exportData() {
        let data = formatIds();
        //Connect to endpoint
        console.log(data);
    }
}];
