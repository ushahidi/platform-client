
/**
 * @ngdoc overview
 * @name ui.tabs
 *
 * @description
 * AngularJS version of the tabs directive.
 */

require('angular/angular');
module.exports = angular.module('ui.tabs', [])

.controller('TabsetController', ['$scope', '$element', '$attrs', function TabsetCtrl($scope, $element, $attrs) {
	var ctrl = this,
			tabs = ctrl.tabs = $scope.tabs = [];

	$scope.collapsible = angular.isDefined($attrs.collapsible);

	ctrl.select = function(selectedTab) {
		// Close other tabs
		angular.forEach(tabs, function(tab) {
			if (tab.active && tab !== selectedTab) {
				tab.active = false;
				tab.onDeselect();
			}
		});

		// Close tab if already open (and collapsible)
		if (selectedTab.active && $scope.collapsible)
		{
			selectedTab.active = false;
			selectedTab.onDeselect();
		}
		// Show tab
		else
		{
			selectedTab.active = true;
			selectedTab.onSelect();
		}
	};

	ctrl.addTab = function addTab(tab) {
		tabs.push(tab);
		// we can't run the select function on the first tab
		// since that would select it twice
		if (tabs.length === 1 && ! $scope.collapsible) {
			tab.active = true;
		} else if (tab.active) {
			ctrl.select(tab);
		}
	};

	ctrl.removeTab = function removeTab(tab) {
		var index = tabs.indexOf(tab);
		//Select a new tab if the tab to be removed is selected
		if (tab.active && tabs.length > 1) {
			//If this is the last tab, select the previous tab. else, the next tab.
			var newActiveIndex = (index === tabs.length - 1) ? index - 1 : index + 1;
			ctrl.select(tabs[newActiveIndex]);
		}
		tabs.splice(index, 1);
	};
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabset
 * @restrict EA
 *
 * @description
 * Tabset is the outer container for the tabs directive
 *
 */
.directive('tabset', function() {
	return {
		restrict: 'AC',
		scope: {
			type: '@'
		},
		controller: 'TabsetController'
	};
})

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tab
 * @restrict EA
 *
 * @param {string=} select An expression to evaluate when the tab is selected.
 * @param {boolean=} active A binding, telling whether or not this tab is selected.
 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
 *
 * @description
 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
 *
 */
.directive('tab', ['$parse', '$animate', function($parse, $animate) {
	return {
		require: '^tabset',
		restrict: 'AC',
		scope: {
			active: '=?',
			onSelect: '&select',
			onDeselect: '&deselect'
		},
		controller: ['$scope', function TabCtrl($scope) {
			this.select = function() {
				if ( !$scope.disabled ) {
					$scope.$apply(function($scope) {
						$scope.tabsetCtrl.select($scope);
					});
				}
			};
		}],
		link: function(scope, elm, attrs, tabsetCtrl) {
			scope.active = angular.isDefined(attrs.active) ? true : false;

			scope.tabsetCtrl = tabsetCtrl;

			scope.$watch('active', function(active) {
				$animate[active ? 'addClass' : 'removeClass'](elm, 'active');
			});

			scope.disabled = false;
			if ( attrs.disabled ) {
				scope.$parent.$watch($parse(attrs.disabled), function(value) {
					scope.disabled = !! value;
				});
			}

			tabsetCtrl.addTab(scope);
			scope.$on('$destroy', function() {
				tabsetCtrl.removeTab(scope);
			});
		}
	};
}])


/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabHeading
 * @restrict EA
 *
 * @description
 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
 *
 */
.directive('tabHeading', [function() {
	return {
		restrict: 'AC',
		require: '^tab',
		link: function (scope, element, attrs, tabCtrl) {
			if ( !tabCtrl ) {
				return;
			}

			element.bind('click', tabCtrl.select);
		}
	};
}])

;
