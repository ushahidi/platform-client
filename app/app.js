require('angular');
require('angular-route');
require('leaflet');
require('leaflet.markercluster');
require('leaflet.locatecontrol/src/L.Control.Locate');
require('angular-leaflet-directive');
require('angular-resource');
require('angular-translate');
require('angular-bootstrap/dist/ui-bootstrap-tpls');
require('angular-ui-bootstrap-datetimepicker');
require('angular-moment');
require('angular-sanitize');
require('angular-markdown-directive');
require('angular-local-storage');
require('checklist-model/checklist-model');
require('angular-gravatar/build/md5');
require('angular-gravatar/build/angular-gravatar');
window.jQuery = require('jquery'); // Required for jasny-bootstrap
require('jasny-bootstrap/js/offcanvas');
require('ngGeolocation/ngGeolocation');
window.d3 = require('d3'); // Required for nvd3
require('./common/wrapper/nvd3-wrapper');
require('angular-nvd3/src/angular-nvd3');

require('./post/post-module.js' );
require('./tool/tool-module.js' );
require('./set/set-module.js'   );
require('./user-profile/user-profile-module.js');
require('./workspace/workspace-module.js');

// this 'environment variable' will be set within the gulpfile
var backendUrl = process.env.BACKEND_URL || 'http://ushahidi-backend',
    claimedAnonymousScopes = [
        'posts',
        'media',
        'forms',
        'api',
        'tags',
        'sets',
        'users',
        'stats',
        'layers',
        'config',
        'messages'
    ];

angular.module('app',
    [
        'checklist-model',
        'ngRoute',
        'ngResource',
        'LocalStorageModule',
        'pascalprecht.translate',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'ui.gravatar',
        'leaflet-directive',
        'angularMoment',
        'btford.markdown',
        'posts',
        'tools',
        'sets',
        'user-profile',
        'workspace',
        'ngGeolocation',
        'nvd3'
    ])

    .constant('CONST', {
        BACKEND_URL         : backendUrl,
        API_URL             : backendUrl + '/api/v2',
        DEFAULT_LOCALE      : 'en_US',
        OAUTH_CLIENT_ID     : 'ushahidiui',
        OAUTH_CLIENT_SECRET : '35e7f0bca957836d05ca0492211b0ac707671261',
        CLAIMED_ANONYMOUS_SCOPES : claimedAnonymousScopes,
        CLAIMED_USER_SCOPES : claimedAnonymousScopes.concat('dataproviders')
    })

    .service('Authentication'        , require('./common/services/authentication.js'           ))
    .service('Session'               , require('./common/services/session.js'                  ))
    .service('ConfigEndpoint'        , require('./common/services/endpoints/config.js'         ))
    .service('UserEndpoint'          , require('./common/services/endpoints/user-endpoint.js'  ))
    .service('FormEndpoint'          , require('./common/services/endpoints/form.js'           ))
    .service('FormAttributeEndpoint' , require('./common/services/endpoints/form-attributes.js'))
    .service('TagEndpoint'           , require('./common/services/endpoints/tag.js'            ))
    .service('RoleHelper'            , require('./common/services/role-helper.js'              ))
    .service('Config'                , require('./common/services/config.js'                   ))
    .service('Util'                  , require('./common/services/util.js'                     ))
    .service('Notify'                , require('./common/services/notify.js'                   ))
    .service('multiTranslate'        , require('./common/services/multi-translate.js'          ))
    .service('GlobalFilter'          , require('./common/services/global-filter.js'            ))
    .service('Maps'                  , require('./common/services/maps.js'                     ))
    .service('Geocoding'             , require('./common/services/geocoding.js'                ))

    .controller('navigation'       , require('./common/controllers/navigation.js'        ))
    .controller('adminMapSettings' , require('./common/controllers/admin/map-settings.js'))

    .config(require('./common/configs/authentication-interceptor.js'      ))
    .config(require('./common/configs/locale-config.js'                   ))
    .config(require('./common/common-routes.js'                           ))
    .config(require('./common/configs/ui-bootstrap-template-decorators.js'))
    .config(require('./gravatar-config.js'                                ))

    .run(require('./common/global/event-handlers.js'))

    .factory('jQuery', function() {
        return window.jQuery;
    })
    .factory('_', function() {
        return require('underscore/underscore');
    })
    .factory('d3', function() {
        return window.d3;
    })
    .factory('URI', function() {
        return require('URIjs/src/URI.js');
    })
    .factory('Leaflet', function() {
        return window.L;
    })
    ;
