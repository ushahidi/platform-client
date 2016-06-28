module.exports = [
    '$rootScope',
    '$translate',
    'ModalService',
    '_',
function (
    $rootScope,
    $translate,
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
                $scope.openAttributeEditModal($scope.activeTask, _.extend($scope.newAttribute, type));
            };

            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.availableAttrTypes = [
                {
                    label: 'Short text',
                    type: 'varchar',
                    input: 'text',
                    description: $translate.instant('survey.text_desc')
                },
                {
                    label: 'Long text',
                    type: 'text',
                    input: 'textarea',
                    description: $translate.instant('survey.textarea_desc')
                },
                {
                    label: 'Number (Decimal)',
                    type: 'decimal',
                    input: 'number',
                    description: $translate.instant('survey.decimal_desc')
                },
                {
                    label: 'Number (Integer)',
                    type: 'int',
                    input: 'number',
                    description: $translate.instant('survey.integer_desc')
                },
                {
                    label: 'Location',
                    type: 'point',
                    input: 'location',
                    description: $translate.instant('survey.location_desc')
                },
                // {
                //     label: 'Geometry',
                //     type: 'geometry',
                //     input: 'text'
                // },
                {
                    label: 'Date',
                    type: 'datetime',
                    input: 'date',
                    description: $translate.instant('survey.date_desc')
                },
                {
                    label: 'Date & time',
                    type: 'datetime',
                    input: 'datetime',
                    description: $translate.instant('survey.datetime_desc')
                },
                // {
                //     label: 'Time',
                //     type: 'datetime',
                //     input: 'time'
                // },
                {
                    label: 'Select',
                    type: 'varchar',
                    input: 'select',
                    description: $translate.instant('survey.select_desc')
                },
                {
                    label: 'Radio Buttons(s)',
                    type: 'varchar',
                    input: 'radio',
                    description: $translate.instant('survey.radio_desc')
                },
                {
                    label: 'Checkbox(es)',
                    type: 'varchar',
                    input: 'checkbox',
                    cardinality: 0,
                    description: $translate.instant('survey.checkbox_desc')
                },
                {
                    label: 'Related Post',
                    type: 'relation',
                    input: 'relation',
                    description: $translate.instant('survey.relation_desc')
                },
                {
                    label: 'Image',
                    type: 'media',
                    input: 'upload',
                    description: $translate.instant('survey.upload_desc')
                }
            ];
        }
    };
}];
