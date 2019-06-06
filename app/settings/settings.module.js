import { react2angular } from "react2angular";
import angular from "angular";
import TestRouteContainer from "./TestRouteContainer";
import PersonContainer from "../react/settings/people/PersonContainer";
import UserListContainer from "../react/settings/users/UserList/UserListContainer";
import UserAvatar from "../react/settings/users/UserList/UserAvatar";
import UserName from "../react/settings/users/UserList/userName";
import UserRole from "../react/settings/users/UserList/UserRole";

angular
    .module("ushahidi.settings", [])
    .directive(
        "afterImportCsv",
        require("./data-import/data-after-import.directive.js")
    )
    .directive("importerCsv", require("./data-import/data-import.directive.js"))
    .service("ImportNotify", require("./data-import/import.notify.service.js"))

    .directive("surveyEditor", require("./surveys/survey-editor.directive.js"))
    .directive(
        "surveyTaskCreate",
        require("./surveys/task-create.directive.js")
    )
    .directive(
        "surveyAttributeCreate",
        require("./surveys/attribute-create.directive.js")
    )
    .directive(
        "surveyAttributeEditor",
        require("./surveys/attribute-editor.directive.js")
    )
    .service("SurveyNotify", require("./surveys/survey.notify.service.js"))

    .directive(
        "targetedQuestion",
        require("./surveys/targeted-surveys/targeted-question.directive.js")
    )

    .directive("settingsMap", require("./site/map.directive.js"))
    .directive("settingsEditor", require("./site/editor.directive.js"))

    .directive("filterUsers", require("./users/filter-users.directive.js"))

    .directive("customRoles", require("./roles/roles.directive.js"))
    .directive("customRolesEditor", require("./roles/editor.directive.js"))

    .directive("customWebhooks", require("./webhooks/webhooks.directive.js"))
    .directive(
        "customWebhooksEditor",
        require("./webhooks/editor.directive.js")
    )

    .component("testRouteContainer", react2angular(TestRouteContainer, ["id"]))
    .component("personContainer", react2angular(PersonContainer))
    .component("userListContainer", react2angular(UserListContainer))
    .component("userAvatar", react2angular(UserAvatar), ["avatar", "realname"])
    .component("userName", react2angular(UserName), ["user"])
    .component("userRole", react2angular(UserRole), ["role"])

    .config(require("./settings.routes.js"));
