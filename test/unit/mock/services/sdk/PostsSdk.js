module.exports = [function () {
    return {
        getPosts: function (id) {
            return {
                then: function (successCallback, failCallback) {
                    if (id) {
                         successCallback({'id':1});
                    } else {
                        successCallback([{'id':1},{'id':2}]);
                    }
                }
            };
        },
        savePost: function (post) {
            return  {
                then: function (successCallback, failCallback) {
                    if (post.id !== 'fail') {
                        successCallback({id: 1, allowed_privileges: [
                            'read',
                            'create',
                            'update',
                            'delete',
                            'search',
                            'change_status',
                            'read_full'
                            ]})
                    } else {
                        failCallback({data:{errors:['error']}});
                    }
                }
            };
        },
        deletePost: function () {
            return  {
                then: function (successCallback, failCallback) {
                    successCallback({id: 1});
                }
            }
        },
        patchPost: function () {
            return {
                then: function (successCallback, failCallback) {
                    successCallback({id: 1});
                }
            }
        }
    };
}];
