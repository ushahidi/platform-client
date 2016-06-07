module.exports = [
    '$rootScope',
    'ModalService',
    '_',
function (
    $rootScope,
    ModalService,
    _
) {
    return {
        restrict: 'E',
        templateUrl: 'templates/settings/surveys/modify/survey-attribute-create.html',
        link: function ($scope, $element, $attrs) {

            // Init an empty saved search
            $scope.newAttribute = {
                required: false,
                options: [],
                config: {},
                priority: 0
            };

            $scope.createNewAttribute = function (type) {
                // Set initial label name based on type
                type.label = 'New ' + type.label.toLowerCase() + ' field';
                $scope.labelChanged(type);
                $scope.openAttributeEditModal(_.extend($scope.newAttribute, type));
            };

            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.availableAttrTypes = [
                {
                    label: 'Short text',
                    type: 'varchar',
                    input: 'text'
                },
                {
                    label: 'Long text',
                    type: 'text',
                    input: 'textarea'
                },
                {
                    label: 'Number (Decimal)',
                    type: 'decimal',
                    input: 'number'
                },
                {
                    label: 'Number (Integer)',
                    type: 'int',
                    input: 'number'
                },
                {
                    label: 'Location',
                    type: 'point',
                    input: 'location'
                },
                // {
                //     label: 'Geometry',
                //     type: 'geometry',
                //     input: 'text'
                // },
                {
                    label: 'Date',
                    type: 'datetime',
                    input: 'date'
                },
                {
                    label: 'Date & time',
                    type: 'datetime',
                    input: 'datetime'
                },
                // {
                //     label: 'Time',
                //     type: 'datetime',
                //     input: 'time'
                // },
                {
                    label: 'Select',
                    type: 'varchar',
                    input: 'select'
                },
                {
                    label: 'Radio',
                    type: 'varchar',
                    input: 'radio'
                },
                {
                    label: 'Checkbox',
                    type: 'varchar',
                    input: 'checkbox',
                    cardinality: 0
                },
                {
                    label: 'Related Post',
                    type: 'relation',
                    input: 'relation'
                },
                {
                    label: 'Image',
                    type: 'media',
                    input: 'upload'
                }
            ];
        }
    };
}];
