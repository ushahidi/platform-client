module.exports = AccessibilityService;
function AccessibilityService() {
    return {
        setFocus,
    };
    function setFocus(id) {
        return document.getElementById(id).focus();
    }
}
