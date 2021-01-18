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
        template: require('./attribute-create.html'),
        link: function ($scope, $element, $attrs) {

            // Init an empty saved search
            $scope.newField = {
                required: false,
                options: [],
                config: {},
                priority: 0,
                translations:{}
            };

            $scope.createNewField = function (type) {
                // Set initial label name based on type
                type.label = '';
                $scope.openFieldEditModal($scope.activeTask, _.extend($scope.newField, type));
            };

            $scope.closeModal = function () {
                ModalService.close();
            };

            $scope.availableFieldTypes = [
                {
                    label: $translate.instant('survey.short_text'),
                    type: 'varchar',
                    input: 'text',
                    description: $translate.instant('survey.text_desc')
                },
                {
                    label: $translate.instant('survey.long_text'),
                    type: 'text',
                    input: 'textarea',
                    description: $translate.instant('survey.textarea_desc')
                },
                {
                    label: $translate.instant('survey.number_decimal'),
                    type: 'decimal',
                    input: 'number',
                    description: $translate.instant('survey.decimal_desc')
                },
                {
                    label:  $translate.instant('survey.number_integer'),
                    type: 'int',
                    input: 'number',
                    description: $translate.instant('survey.integer_desc')
                },
                {
                    label: $translate.instant('survey.location'),
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
                    label: $translate.instant('survey.date'),
                    type: 'datetime',
                    input: 'date',
                    description: $translate.instant('survey.date_desc')
                },
                {
                    label: $translate.instant('survey.datetime'),
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
                    label: $translate.instant('survey.select'),
                    type: 'varchar',
                    input: 'select',
                    description: $translate.instant('survey.select_desc')
                },
                {
                    label:  $translate.instant('survey.radio_button'),
                    type: 'varchar',
                    input: 'radio',
                    description: $translate.instant('survey.radio_desc')
                },
                {
                    label: $translate.instant('survey.checkbox'),
                    type: 'varchar',
                    input: 'checkbox',
                    cardinality: 0,
                    description: $translate.instant('survey.checkbox_desc')
                },
                {
                    label: $translate.instant('survey.related_post'),
                    type: 'relation',
                    input: 'relation',
                    description: $translate.instant('survey.relation_desc')
                },
                {
                    label: $translate.instant('survey.upload_image'),
                    type: 'media',
                    input: 'upload',
                    description: $translate.instant('survey.upload_desc'),
                    config: {
                        hasCaption: true
                    }
                },
                {
                    label: $translate.instant('survey.embed_video'),
                    type: 'varchar',
                    input: 'video',
                    description: $translate.instant('survey.video_desc')
                },
                {
                    label: 'Markdown',
                    type: 'markdown',
                    input: 'markdown',
                    description: $translate.instant('survey.markdown_desc')
                },
                {
                    label: $translate.instant('survey.categories'),
                    type: 'tags',
                    cardinality: 0,
                    input: 'tags',
                    description: $translate.instant('settings.settings_list.categories_desc')
                }
            ];
        }
    };
}];
