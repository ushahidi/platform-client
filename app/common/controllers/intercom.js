module.exports = [
    '$scope',
    '$rootScope',
    'Authentication',
    'UserEndpoint',
    'ConfigEndpoint',
    '$q',
    '$window',
    '$location',
function (
    $scope,
    $rootScope,
    Authentication,
    UserEndpoint,
    ConfigEndpoint,
    $q,
    $window,
    $location
) {
    $scope.startIntercom = startIntercom;
    $scope.stopIntercom = stopIntercom;

    activate();

    function activate() {
        $rootScope.$on('event:authentication:login:succeeded', function () {
            $scope.startIntercom();
        });

        $rootScope.$on('event:authentication:logout:succeeded', function () {
            $scope.stopIntercom();
        });

        if (Authentication.getLoginStatus()) {
            $scope.startIntercom();
        }
    }
    // This gets the app-id,used to be in index.html
    function getAppId() {
        if (typeof window.intercomSettings !== 'undefined' &&
          typeof(window.intercomSettings.app_id) !== 'undefined') {
          return window.intercomSettings.app_id
        } else if (typeof window.analytics !== 'undefined' &&
          typeof window.analytics._integrations !== 'undefined' &&
          typeof analytics._integrations.Intercom !== 'undefined' &&
          typeof analytics._integrations.Intercom.options !== 'undefined' &&
          typeof analytics._integrations.Intercom.options.appId !== 'undefined') {
          return analytics._integrations.Intercom.options.appId;
        } else {
          return '';
        }
      }

      // Loads the intercom-script when needed
      function loadIntercomScript (intercomOptions) {
          return new Promise((resolve, reject) => {
            // With inspiration from https://github.com/calibreapp/react-live-chat-loader, adjusted for AngularJs
              var w = $window;
              var ic = w.Intercom;
              // Checking if Intercom is already loaded
              if (typeof ic === 'function') {
                ic('reattach_activator');
                //eslint-disable-next-line no-undef
                ic('update', intercomOptions);

              } else {
                // If not loaded, we add it
                var d = document;
                var i = function() {
                  i.c(arguments);
                }
                i.q = [];
                i.c = function(args) {
                  i.q.push(args);
                }
                w.Intercom = i;
                //eslint-disable-next-line no-inner-declarations
                function l() {
                  var s = d.createElement('script');
                  s.type = 'text/javascript';
                  s.async = true;
                  s.src = `https://widget.intercom.io/widget/${getAppId()}`;
                  var x = d.getElementsByTagName('script')[0];
                  x.parentNode.insertBefore(s, x);
                  $window.Intercom('boot', intercomOptions);
                }
                l();
              }
              resolve();
            }, err => {
              reject(err);
            });
          }

    function startIntercom() {
            if ($window.ushahidi.intercomAppId !== '') {
              // First we get all the user-info needed
              $q.all([
                    ConfigEndpoint.get({ id: 'site' }).$promise,
                    UserEndpoint.getFresh({id: 'me'}).$promise
                ]).then(function (results) {
                    var site = results[0];
                    var user = results[1];
                    var domain = $location.host();

                    let intercomOptions = {
                      app_id: $window.ushahidi.intercomAppId,
                      custom_launcher_selector: '#intercom_custom_launcher',
                      email: user.email,
                      created_at: user.created,
                      user_id: domain + '_' + user.id,
                      'deployment_url': domain,
                      'realname' : user.realname,
                      'last_login': user.last_login,
                      'role': user.role,
                      company: {
                          name: site.name,
                          id: domain,
                          created_at: 0, // Faking this because we don't have this data
                          plan: site.tier
                      }
                    }
                    // Then we load the intercom-script
                    loadIntercomScript(intercomOptions)
                });
            }
        }

    function stopIntercom() {
      // Checking if Intercom was loaded before stopping it
        if ($window.ushahidi.intercomAppId !== '' && typeof $window.Intercom === 'function') {
            $window.Intercom('shutdown');
        }
    }
}];
