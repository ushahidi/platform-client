module.exports = [function () {
    return {
        time: {
            scale: function () {
                return {domain: function () {}};
            },
            week: function () {
                return {
                    toISOString: function () {}
                };
            },
            month: function () {}
        },
        scale: {
            ordinal : function () {},
            category20: function () {
                return {
                    range: function () {}
                };
            }
        },
        format: function () {},
        svg: {
            axis: function () {
                return {
                    ticks: function () {
                        return {
                            tickFormat: function () {
                                return {
                                    orient: function () {}
                                };
                            },
                            orient: function () {}
                        };
                    }
                };
            }
        },
        setSelected: function () {},
        clearSelected: function () {}
    };
}];
