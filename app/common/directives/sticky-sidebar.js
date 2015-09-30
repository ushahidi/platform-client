/**
 * Ushahidi Sticky Sidebar
 */

angular.module('ushahidi.common.sticky-sidebar', [])

.directive('stickySidebar', function () {
    // Replacement for jquery.offset
    var offset = function (element) {
        var documentElem,
          box = { top: 0, left: 0 },
          doc = element && element.ownerDocument;

        if (!doc) {
            return;
        }

        documentElem = doc.documentElement;
        box = element.getBoundingClientRect();

        return {
            top: box.top + (window.pageYOffset || documentElem.scrollTop) - (documentElem.clientTop || 0),
            left: box.left + (window.pageXOffset || documentElem.scrollLeft) - (documentElem.clientLeft || 0)
        };
    };
    angular.element.prototype.offset = function (arg1, arg2) {
        return offset(this[0]);
    };

    return {
        controller: ['$scope', '$element', '$attrs', '$document', '$window', function ($scope, $element, $attrs, $document, $window) {
            var sideBar = $element,
                sideBarTopOffset = sideBar.offset().top,
                wndw = angular.element($window);

            var stickySideBar = function () {
                if ($window.innerWidth > 767) { // IF: Screen width is greater than 767px
                    var windowTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop,
                        windowFoot = windowTop + (sideBar.prop('offsetHeight') + 68);

                    if ((sideBarTopOffset < (windowTop - 35)) && (sideBar.prop('offsetHeight') < ($window.innerHeight - 68))) { // IF: Sidebar is vertically positioned behind the toolbar
                        sideBar.css({
                            position: 'fixed',
                            left: sideBar.offset().left + 'px',
                            width: sideBar.prop('offsetWidth') + 'px'
                        });

                        if (windowFoot >= angular.element(document.querySelector('[role=\'contentinfo\']')).offset().top) { // IF: Footer is vertically positioned behind the sidebar
                            return sideBar.css({
                                top: 'auto',
                                bottom: '175px'
                            });
                        } else { // ELSE: Footer is vertically positioned below the sidebar
                            return sideBar.css({
                                top: '68px',
                                bottom: 'auto'
                            });
                        }
                    } else { // ELSE: Sidebar is vertically positioned below the toolbar
                        return sideBar.removeAttr('style');
                    }
                }
            };

            wndw.on('scroll', function () {
                return stickySideBar();
            });

            wndw.on('resize', function () {
                return stickySideBar();
            });

            stickySideBar();
        }]
    };
});
