module.exports = [
    '$window',
    '_',
    function ($window,_) {
        var CONST_ORDER = {
            orderBy: {
                value: 'created',
                labelTranslateKey: 'global_filter.sort.orderBy.filter_type_tag',
                options: [
                    {
                        value: 'post_date',
                        labelTranslateKey: 'global_filter.sort.orderBy.post_date'
                    },
                    {
                        value: 'updated',
                        labelTranslateKey: 'global_filter.sort.orderBy.updated'
                    },
                    {
                        value: 'created',
                        labelTranslateKey: 'global_filter.sort.orderBy.created'
                    }
                ]
            },
            order: {
                value: 'desc',
                labelTranslateKey: 'global_filter.sort.order.filter_type_tag',
                options: [
                    {
                        value: 'desc',
                        labelTranslateKey: 'global_filter.sort.order.desc'
                    },
                    {
                        value: 'asc',
                        labelTranslateKey: 'global_filter.sort.order.asc'
                    }
                ]
            },
            unlockedOnTop: {
                value: false,
                labelTranslateKey: 'global_filter.sort.unlockedOnTop.filter_type_tag'
            }
        };
        var order = {};
        return {
            labelTranslateKey: 'global_filter.sort.filter_type_tag',
            get: function () {
                var returnValue = {};
                _.each(CONST_ORDER, function (key, value) {
                    returnValue[value] = key.value;
                });
                return returnValue;
            },
            getDefinition: function () {
                return CONST_ORDER;
            },
            put: function (orderObj) {
                order = orderObj;
                _.each(orderObj, function (key, val) {
                    CONST_ORDER[key] = CONST_ORDER[key] ? CONST_ORDER[key].value : null;
                });
                return order;
            },
            reset: function () {
                return this.put(CONST_ORDER);
            }
        };
    }];
