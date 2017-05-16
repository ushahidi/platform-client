module.exports = ['$q', function ($q) {
    return {
        query: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({results: [{
                            name: 'test post',
                            allowed_privileges: [
                                'update',
                                'delete',
                                'change_status'
                            ],
                            id: 1
                        }]});
                }
            }};
        },
        stats: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback(
                        {'totals': [{
                            values: [1,2,3,4,5]
                        }]}
                    );
                }
            }};
        },
        options: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        allowed_privileges: ['read'],
                        name: 'test post',
                        id: 1
                    });
                }
            }};
        },
        geojson: function () {
            return {
                /* jshint ignore:start */
                $cancelRequest: function () {},
                $promise: $q.when({"type": "FeatureCollection","features": [{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-122.330062,47.603832]}]},"properties": {"title": "Testing our qa twitter account","description": "Testing our qa twitter account\n\n#ushahidiqatest","marker-color": "#E69327","id": 2600,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2600"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.707703,30.063236]}]},"properties": {"title": "Masonry","description": "785275","marker-color": "#E69327","id": 2573,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2573"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.707146,30.102217]}]},"properties": {"title": "Wood","description": "223488","marker-color": "#E69327","id": 2575,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2575"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.704613,30.118774]}]},"properties": {"title": "Edited","description": "433512","marker-color": "#E69327","id": 2576,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2576"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.700455,30.089579]}]},"properties": {"title": "Wood","description": "206893","marker-color": "#E69327","id": 2570,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2570"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [77.531287,13.075209]},{"type": "Point","coordinates": [77.531287,13.075209]}]},"properties": {"title": "post via twitter","description": "#publicpolicy making in the #digital age https:\/\/t.co\/maAwmik3Zz #PolicyMakers #policymaking #ICT #ICT4D #ICT4D2016 #ICT4Dev #techforgood","marker-color": "#E69327","id": 2527,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2527"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.711777,30.102261]}]},"properties": {"title": "119736","description": "Masonry","marker-color": "#E69327","id": 2508,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2508"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.702675,30.060614]}]},"properties": {"title": "172534","description": "Wood","marker-color": "#E69327","id": 2512,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2512"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.707703,30.063236]}]},"properties": {"title": "785275","description": "Masonry","marker-color": "#E69327","id": 2513,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2513"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.713882,30.102226]}]},"properties": {"title": "995932","description": "Reinforced Concrete","marker-color": "#E69327","id": 2514,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2514"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.707664,30.063936]}]},"properties": {"title": "Masonry","description": "448094","marker-color": "#E69327","id": 2446,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2446"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.700455,30.089579]}]},"properties": {"title": "Wood","description": "206893","marker-color": "#E69327","id": 2447,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2447"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.707703,30.063236]}]},"properties": {"title": "Wood","description": "333743","marker-color": "#E69327","id": 2448,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2448"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.702675,30.060614]}]},"properties": {"title": "Wood","description": "172534","marker-color": "#E69327","id": 2449,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2449"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.707703,30.063236]}]},"properties": {"title": "Masonry","description": "785275","marker-color": "#E69327","id": 2450,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2450"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.713882,30.102226]}]},"properties": {"title": "Reinforced Concrete","description": "995932","marker-color": "#E69327","id": 2451,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2451"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.711777,30.102261]}]},"properties": {"title": "Masonry","description": "119736","marker-color": "#E69327","id": 2427,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2427"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.702675,30.060614]}]},"properties": {"title": "Wood","description": "172534","marker-color": "#E69327","id": 2431,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2431"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.707703,30.063236]}]},"properties": {"title": "Masonry","description": "785275","marker-color": "#E69327","id": 2432,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2432"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-81.713882,30.102226]}]},"properties": {"title": "Reinforced Concrete","description": "995932","marker-color": "#E69327","id": 2433,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2433"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [-122.330062,47.603832]}]},"properties": {"title": "jess testing radio button fix","description": "radio button pattern should match pattern library","marker-color": "#A51A1A","id": 2287,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/2287"}},{"type": "Feature","geometry": {"type": "GeometryCollection","geometries": [{"type": "Point","coordinates": [36.817245,-1.283253]}]},"properties": {"title": "Sample post type from Angie","description": "This is my sample image post","marker-color": "#2274B4","id": 24,"url": "http:\/\/qa.api.ushahididev.com\/api\/v3\/posts\/24"}}]})
                /* jshint ignore:end */
            };
        },
        get: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({
                        name: 'test post',
                        id: 1
                    });
                }
            }};
        },
        getFresh: function () {
            return {
                name: 'test post',
                id: 1
            };
        },
        delete: function (post) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    post.id === 'pass' ? successCallback({id: 1, allowed_privileges: ['read']}) : failCallback('error');
                }
            }};
        },
        savecache: function (post) {
            return {$promise: {
                then: function (successcallback, failcallback) {
                    post.id === 'pass' ? successcallback({id: 1, allowed_privileges: ['read']}) : failcallback('error');
                }
            }};
        },
        update: function (post) {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    post.id === 'pass' ? successCallback({id: 1, allowed_privileges: ['read']}) : failCallback(
                      {
                        data: {
                            errors: [
                                'error'
                            ]
                        }
                    });
                }
            }};
        }
    };
}];
