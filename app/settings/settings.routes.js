import settingsController from "./settings.controller";
import settings from "./settings.html";

import settingsListController from "./settings-list.controller";
import settingsList from "./settings-list.html";

import siteController from "./site/site.controller";
import settingsGeneral from "./site/settings-general.html";

import dataImportController from "./data-import/data-import.controller";
import dataImport from "./data-import/data-import.html";

import dataAfterImportController from "./data-import/data-after-import.controller";
import afterImport from "./data-import/after-import.html";

import dataExportController from "./data-export/data-export.controller";
import dataExport from "./data-export/data-export.html";

import surveysController from "./surveys/surveys.controller";
import surveys from "./surveys/surveys.html";

import surveyEditController from "./surveys/edit.controller";
import surveyEdit from "./surveys/survey-edit.html";

import targetedEditController from "./surveys/targeted-surveys/targeted-edit.controller";
import targetedSurveyEdit from "./surveys/targeted-surveys/targeted-survey-edit.html";

import categoriesController from "./categories/categories.controller";
import categories from "./categories/categories.html";

import categoriesEditController from "./categories/edit.controller";
import categoriesEdit from "./categories/categories-edit.html";

import usersController from "./users/users.controller";
import users from "./users/users.html";

import usersEditController from "./users/edit.controller";
import usersEdit from "./users/users-edit.html";

import rolesController from "./roles/roles.controller";
import roles from "./roles/roles.html";
import rolesEdit from "./roles/roles-edit.html";

import webhooksController from "./webhooks/webhooks.controller";
import webhooks from "./webhooks/webhooks.html";
import webhooksEdit from "./webhooks/webhooks-edit.html";

import datasourcesController from "./datasources/datasources.controller";
import datasources from "./datasources/datasources.html";

import plansController from "./plans/plans.controller";
import plans from "./plans/plan.html";

import userSettingsController from "./user-settings/user-settings.controller.js";
import userSettings from "./user-settings/user-settings.html";

import hdxExportController from "./data-export/hdx-export.controller.js";
import hdxExport from "./data-export/hdx-export.html";

module.exports = [
    "$stateProvider",
    "$urlMatcherFactoryProvider",
    ($stateProvider, $urlMatcherFactoryProvider) => {
        $urlMatcherFactoryProvider.strictMode(false);
        /* todo: these routes should only exist when the user is admin! */
        $stateProvider
            .state({
                name: "settings",
                controller: settingsController,
                template: settings
            })
            .state({
                name: "settings.list",
                url: "/settings",
                controller: settingsListController,
                template: settingsList
            })
            .state({
                name: "settings.general",
                url: "/settings/general",
                controller: siteController,
                template: settingsGeneral
            })
            .state({
                name: "settings.dataImport",
                url: "/settings/data-import",
                controller: dataImportController,
                template: dataImport
            })
            .state({
                name: "settings.dataAfterImport",
                url: "/settings/data-after-import",
                controller: dataAfterImportController,
                template: afterImport
            })
            .state({
                name: "settings.userSettings",
                url: "/settings/user-settings",
                controller: userSettingsController,
                template: userSettings
            })
            .state({
                name: "settings.dataExport",
                url: "/settings/data-export",
                controller: dataExportController,
                template: dataExport
            })
            .state({
                name: "settings.hdx",
                url: "/settings/hdx",
                controller: hdxExportController,
                template: hdxExport
            })
            .state({
                name: "settings.surveys",
                url: "/settings/surveys",
                controller: surveysController,
                template: surveys
            })
            .state({
                name: "settings.surveys.create",
                url: "/create",
                controller: surveyEditController,
                template: surveyEdit
            })
            .state({
                name: "settings.surveys.id",
                url: "/:action/:id",
                controller: surveyEditController,
                template: surveyEdit
            })
            .state({
                name: "settings.surveys.targeted",
                url: "/targeted-survey"
            })
            .state({
                name: "settings.surveys.targeted.create",
                url: "/targeted-survey/create",
                controller: targetedEditController,
                template: targetedSurveyEdit
            })
            .state({
                name: "settings.surveys.targeted.published",
                url: "/targeted-survey/published/:id",
                controller: targetedEditController,
                template: targetedSurveyEdit
            })
            .state({
                name: "settings.categories",
                url: "/settings/categories",
                controller: categoriesController,
                template: categories
            })
            .state({
                name: "settings.categories.create",
                url: "/create",
                controller: categoriesEditController,
                template: categoriesEdit
            })
            .state({
                name: "settings.categories.edit",
                url: "/:id",
                controller: categoriesEditController,
                template: categoriesEdit
            })
            .state({
                name: "settings.users",
                url: "/settings/users",
                controller: usersController,
                template: users
            })
            .state({
                name: "settings.createUser",
                url: "/settings/users/create",
                controller: [
                    "$location",
                    "$window",
                    ($location, $window) => {
                        $window.history.pushState(
                            null,
                            "any",
                            $location.absUrl()
                        );
                    }
                ],
                template: "<person-container></person-container>"
            })
            .state({
                name: "settings.users.edit",
                url: "/:id",
                controller: usersEditController,
                template: usersEdit
            })
            .state({
                name: "settings.roles",
                url: "/settings/roles",
                controller: rolesController,
                template: roles
            })
            .state({
                name: "settings.roles.create",
                url: "/create",
                controller: rolesController,
                template: rolesEdit
            })
            .state({
                name: "settings.roles.edit",
                url: "/:id",
                controller: rolesController,
                template: rolesEdit
            })
            .state({
                name: "settings.webhooks",
                url: "/settings/webhooks",
                controller: webhooksController,
                template: webhooks
            })
            .state({
                name: "settings.webhooks.create",
                url: "/create",
                controller: webhooksController,
                template: webhooksEdit
            })
            .state({
                name: "settings.webhooks.edit",
                url: "/:id",
                controller: webhooksController,
                template: webhooksEdit
            })
            .state({
                name: "settings.datasources",
                url: "/settings/datasources",
                controller: datasourcesController,
                template: datasources
            })
            .state({
                name: "settings.plan",
                url: "/settings/plan",
                controller: plansController,
                template: plans
            })
            .state({
                name: "testroute",
                url: "/settings/testroute/:id?",
                controller: [
                    "$scope",
                    "$transition$",
                    ($scope, $transition$) => {
                        $scope.id = $transition$.params().id;
                    }
                ],
                template:
                    '<test-route-container id="id"></test-route-container>'
            });
    }
];
