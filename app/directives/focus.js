module.exports = [function(){

    return function(scope, element, attrs) {
        scope.$watch(attrs.inFocus,
            function (newValue) {
                window.setTimeout(function() {
                    newValue && element[0].focus();
                });
        },true);
    };

}];
