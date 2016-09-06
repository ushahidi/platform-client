module.exports = [function () {
    return {
        getMap: function () {
            return {
                then: function (successCallback, failCallback) {
                    successCallback({
                        setZoom: function () {},
                        getMinZoom: function () {
                            return 0;
                        },
                        getMaxZoom: function () {
                            return 0;
                        },
                        getZoom: function () {
                            return 0;
                        },
                        fitBounds: function () {},
                        attributionControl: {
                            setPrefix: function () {}
                        }
                    });
                }
            };
        },
        getGeoJSON : function () {
            return {
                then: function (successCallback, failCallback) {
                    successCallback({
                        getBounds: function () {
                            return [];
                        }
                    });
                }
            };
        }
    };
}];
