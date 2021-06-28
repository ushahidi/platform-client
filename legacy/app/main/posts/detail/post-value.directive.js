module.exports = ['PostEndpoint', 'moment', '_','PostsSdk', function (PostEndpoint, moment, _, PostsSdk) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            key: '=',
            attribute: '=',
            type: '=',
            activeLanguage: '=',
            post: '='
        },
        template: require('./post-value.html'),
        link: function ($scope) {
            // This whole directive is wrong and it should feel wrong
            // Depending on whether we are dealing with a post task or a standard task
            // the css class is swapped. This Boolean manages that distinction.
            $scope.standardTask = $scope.type === 'standard';
            $scope.isText = isText;
            function isText() {
                if ($scope.attribute.type === 'title' || $scope.attribute.type === 'description' || $scope.attribute.input === 'text' ||  $scope.attribute.type === 'text' || $scope.attribute.type === 'markdown') {
                    return true;
                }
                return false;
            }
            if ($scope.attribute.type === 'relation') {
                PostsSdk.findPostTo($scope.attribute.value.value, 'list').then(post=>{
                    $scope.attribute.value.value = post.data.result;
                    $scope.$apply();
                });
            }
            if ($scope.attribute.input === 'checkbox' || $scope.attribute.input === 'radio' || $scope.attribute.input === 'select') {
                if (!$scope.attribute.value.translations) {
                    $scope.attribute.value.translations = {};
                }
                $scope.attribute.value.translations = Object.assign({}, $scope.attribute.value.translations);
                 _.each($scope.attribute.translations, (translation, key) => {
                    let translatedOptions = [];
                    if ($scope.attribute.input === 'checkbox') {
                        _.each($scope.attribute.value.value, (value, index) => {
                            if (translation.options && translation.options[index]) {
                                    translatedOptions.push(translation.options[index]);
                            }
                        });
                    } else {
                        _.each($scope.attribute.options, (value, index) => {
                            if (value === $scope.attribute.value.value) {
                                translatedOptions = translation.options[index];
                            }
                        });
                    }
                        if (!$scope.attribute.value.translations[key]) {
                            $scope.attribute.value.translations[key] = {};
                        }
                        $scope.attribute.value.translations[key].value = translatedOptions;
                    });
            }
            // The below fix is to remove trailing decimals
            // from the value fetched from the database.
            if ($scope.attribute.type === 'decimal') {
                $scope.attribute.value.value = parseFloat($scope.attribute.value.value);
            }

            if ($scope.attribute.type === 'datetime') {
                if ($scope.attribute.input === 'date') {
                    $scope.attribute.value.value = moment($scope.attribute.value.value).format('LL');
                }
                if ($scope.attribute.input === 'datetime') {
                    $scope.attribute.value.value = moment($scope.attribute.value.value).format('LLL');
                }
                if ($scope.attribute.input === 'time') {
                    $scope.attribute.value.value = moment($scope.attribute.value.value).format('LT');
                }
            }
        }
    };
}];
