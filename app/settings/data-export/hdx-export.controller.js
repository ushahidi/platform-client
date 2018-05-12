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
    $scope.selectAttribute = selectAttribute;
    $scope.addAnother = addAnother;
    $scope.range = range;
    $scope.selectTag = selectTag;
    $scope.exportData = exportData;
    $scope.selectAll = selectAll;
    $scope.isLoading = LoadingProgress.getLoadingState;

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
    function range(attribute) {
        if (!attribute.nbAttributes) {
            attribute.nbAttributes = 1;
        }
        return _.range(attribute.nbAttributes);
    }

    function addAnother(attribute) {
        attribute.nbAttributes++;
    }

    function activate() {
        HxlExport.getFormsWithTags().then((formsWithTags)=> {
            $scope.forms = formsWithTags;
        });
    }

    function selectAll(form) {
        if (form.selected) {
            _.each(form.attributes, (attribute) => {
                attribute.selected = [attribute.id];
            });
        } else {
            _.each(form.attributes, (attribute) => {
                attribute.selected = [];
            });
        }
    }

    function selectTag(attribute) {
        if (attribute.selectedTag && attribute.selectedTag.tag_name) {
            attribute.pretty = '#' + attribute.selectedTag.tag_name;
        } else {
            attribute.pretty = '';
        }
        attribute.nbAttributes = 1;
        attribute.selectedAttributes = {};
    }

    function selectAttribute(attribute) {
        attribute.pretty = '#' + attribute.selectedTag.tag_name;
        _.each(attribute.selectedAttributes, (hxl_attribute) => {
            if (hxl_attribute !== '') {
                attribute.pretty = attribute.pretty + '+' + hxl_attribute.attribute;
            }
        });
    }

    function formatIds() {
        let data = [];
        _.each($scope.forms, (form) => {
                _.each(form.attributes, (attribute) => {
                        if (attribute.selected && attribute.selected.length > 0) {
                            let ids = {
                                    form_attribute_id : attribute.id,
                                    hxl_tag: null
                                };

                            if (attribute.selectedTag) {
                                ids.hxl_tag = {
                                    hxl_tag_id: attribute.selectedTag.id
                                };

                                if (attribute.selectedAttributes) {
                                    ids.hxl_tag.hxl_attribute_ids = [];
                                    _.each(attribute.selectedAttributes, (hxlAttribute) => {
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
