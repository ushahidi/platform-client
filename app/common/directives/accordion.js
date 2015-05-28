/**
 * Ushahidi Angular Toggle directive
 * Based on the Angular Bootstrap Dropdown/Accordion directives
 */

angular.module('ushahidi.common.accordion', [])

.constant('accordionConfig', {
    closeOthers: true,
    openClass: 'open'
})

.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

    // This array keeps track of the accordion groups
    this.groups = [];

    // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
    this.closeOthers = function (openGroup) {
        var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
        if (closeOthers) {
            angular.forEach(this.groups, function (group) {
                if (group !== openGroup) {
                    group.isOpen = false;
                }
            });
        }
    };

    // This is called from the accordion-group directive to add itself to the accordion
    this.addGroup = function (groupScope) {
        var that = this;
        this.groups.push(groupScope);

        groupScope.$on('$destroy', function (event) {
            that.removeGroup(groupScope);
        });
    };

    // This is called from the accordion-group directive when to remove itself
    this.removeGroup = function (group) {
        var index = this.groups.indexOf(group);
        if (index !== -1) {
            this.groups.splice(index, 1);
        }
    };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('accordion', function () {
    return {
        restrict: 'EA',
        controller: 'AccordionController'
    };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('accordionGroup', ['$animate', function ($animate) {
    return {
        require: ['^accordion', 'accordionGroup'],         // We need this directive to be inside an accordion
        restrict: 'EA',
        scope: {
            isOpen: '=?',
            isDisabled: '=?'
        },
        controller: ['$scope', '$attrs', '$parse', 'accordionConfig', function ($scope, $attrs, $parse, accordionConfig) {
            var self = this,
                scope = $scope,//.$new(), // create a child scope so we are not polluting original one
                openClass = accordionConfig.openClass;

            this.init = function (element, accordionCtrl) {
                self.$element = element;
                self.accordionCtrl = accordionCtrl;

                accordionCtrl.addGroup(scope);
            };

            this.trigger = function (open) {
                return (scope.isOpen = arguments.length ? !!open : !scope.isOpen);
            };

            // Allow other directives to watch status
            this.isOpen = function () {
                return scope.isOpen;
            };

            scope.$watch(self.isOpen, function (isOpen, wasOpen) {
                if (isOpen) {
                    self.accordionCtrl.closeOthers(scope);
                }

                $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);
            });

            $scope.$on('$locationChangeSuccess', function () {
                scope.isOpen = false;
            });

            $scope.$on('$destroy', function () {
                scope.$destroy();
            });
        }],
        link: function (scope, element, attrs, ctrl) {
            var accordionCtrl = ctrl[0],
                accordionGroupCtrl = ctrl[1];

            accordionGroupCtrl.init(element, accordionCtrl);
        }
    };
}])

// accordion-trigger indicates the element that will expand/collapse the accordion
.directive('accordionTrigger', function () {
    return {
        restrict: 'EA',
        require: '^accordionGroup',
        link: function (scope, element, attrs, accordionGroupCtrl) {
            if (!accordionGroupCtrl) {
                return;
            }

            accordionGroupCtrl.triggerElement = element;

            var triggerAccordion = function (event) {
                event.preventDefault();

                if (!element.hasClass('disabled') && !attrs.disabled) {
                    scope.$apply(function () {
                        accordionGroupCtrl.trigger();
                    });
                }
            };

            element.bind('click', triggerAccordion);

            // WAI-ARIA
            element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
            scope.$watch(accordionGroupCtrl.isOpen, function (isOpen) {
                element.attr('aria-expanded', !!isOpen);
            });

            scope.$on('$destroy', function () {
                element.unbind('click', triggerAccordion);
            });
        }
    };
})

// accordion-content indicates the block to be expanded
.directive('accordionContent', function () {
    return {
        restrict: 'EA',
        require: '^accordionGroup',
        link: function (scope, element, attrs, accordionGroupCtrl) {
            if (!accordionGroupCtrl) {
                return;
            }

            accordionGroupCtrl.contentElement = element;
        }
    };
})

;
