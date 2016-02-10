module.exports = [function () {
    return {
        queryFresh: function () {
            return {$promise: {
                then: function (successCallback, failCallback) {
                    successCallback({'results': [{
                        name: 'test contact',
                        id: 1
                    }]});
                }
            }};
          },
          get: function () {
              return {$promise: {
                  then: function (successCallback) {
                      successCallback({ 
                          name: 'test contact',
                          id: 1
                      });
                  }
              }};
          },
          delete: function () {
              return {$promise: {
                  then: function (successCallback) {
                      successCallback();
                  }
              }};
          },
          save: function (contact) {
              return {$promise: {
                  then: function (successCallback, failCallback) {
                    contact.name === 'pass' ? successCallback({id:1}) : failCallback('error');
                  }
              }};
          },
          update: function (contact) {
              return {$promise: {
                  then: function (successCallback, failCallback) {
                    contact.id === 'pass' ? successCallback({id:1}) : failCallback('error');
                  }
              }};
          }
      };
  }];
