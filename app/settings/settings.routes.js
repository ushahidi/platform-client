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
    '$stateProvider',
    '$urlMatcherFactoryProvider',
function (
    $stateProvider,
    $urlMatcherFactoryProvider
) {
    $urlMatcherFactoryProvider.strictMode(false);
    /* todo: these routes should only exist when the user is admin! */
    $stateProvider
    .state(
        {
            name: 'settings',
            controller: require('./settings.controller.js'),
            template: require('./settings.html')
        }
    )
    .state(
        {
            name: 'settings.list',
            url: '/settings',
            template: require('./settings-list.html'),
            controller: require('./settings-list.controller.js')
        }
    )
    .state(
        {
            name: 'settings.general',
            url: '/settings/general',
            controller: require('./site/site.controller.js'),
            template: require('./site/settings-general.html')
        }
    )
    .state(
        {
            name: 'settings.dataImport',
            url: '/settings/data-import',
            controller: require('./data-import/data-import.controller.js'),
            template: require('./data-import/data-import.html')
        }
    )
    .state(
        {
            name: 'settings.dataAfterImport',
            url: '/settings/data-after-import',
            controller: require('./data-import/data-after-import.controller.js'),
            template: require('./data-import/after-import.html')
        }
    )
    .state(
        {
            name: 'settings.userSettings',
            url: '/settings/user-settings',
            controller: require('./user-settings/user-settings.controller.js'),
            template: require('./user-settings/user-settings.html')
        }
    )
    .state(
        {
            name: 'settings.dataExport',
            url: '/settings/data-export',
            controller: require('./data-export/data-export.controller.js'),
            template: require('./data-export/data-export.html')
        }
    )
    .state(
        {
            name: 'settings.hdx',
            url: '/settings/hdx',
            controller: require('./data-export/hdx-export.controller.js'),
            template: require('./data-export/hdx-export.html')
        }
    )
    .state(
        {
            name: 'settings.hdxDetails',
            url: '/settings/hdx-details',
            component: 'hdxDetails',
            params: {
                exportJob: null
            }
        }
    )

    .state(
        {
            name: 'settings.surveys',
            url: '/settings/surveys',
            controller: require('./surveys/surveys.controller.js'),
            template: require('./surveys/surveys.html')
        }
    )
    .state(
        {
            name: 'settings.surveys.create',
            url: '/create',
            controller: require('./surveys/edit.controller.js'),
            template: require('./surveys/survey-edit.html')
        }
    )
    .state(
        {
            name: 'settings.surveys.targeted',
            url: '/targeted-survey'
        }
    )
    .state(
        {
            name: 'settings.surveys.targeted.create',
            url: '/targeted-survey/create',
            controller: require('./surveys/targeted-surveys/targeted-edit.controller.js'),
            template: require('./surveys/targeted-surveys/targeted-survey-edit.html')
        }
    )

    .state(
        {
            name: 'settings.surveys.targeted.published',
            url: '/targeted-survey/published/:id',
            controller: require('./surveys/targeted-surveys/targeted-edit.controller.js'),
            template: require('./surveys/targeted-surveys/targeted-survey-edit.html')
        }
    )
    .state(
        {
            name: 'settings.surveys.id',
            url: '/:action/:id',
            controller: require('./surveys/edit.controller.js'),
            template: require('./surveys/survey-edit.html')
        }
    )
    .state(
        {
            name: 'settings.categories',
            url: '/settings/categories',
            controller: require('./categories/categories.controller.js'),
            template: require('./categories/categories.html')
        }
    )
    .state(
        {
            name: 'settings.categories.create',
            url: '/create',
            controller: require('./categories/edit.controller.js'),
            template: require('./categories/categories-edit.html')
        }
    )
    .state(
        {
            name: 'settings.categories.edit',
            url: '/:id',
            controller: require('./categories/edit.controller.js'),
            template: require('./categories/categories-edit.html')
        }
    )
    .state(
        {
            name: 'settings.users',
            url: '/settings/users',
            controller: require('./users/users.controller.js'),
            template: require('./users/users.html')
        }
    )
    .state(
        {
            name: 'settings.users.create',
            url: '/create',
            controller: require('./users/create.controller.js'),
            template: require('./users/users-edit.html')
        }
    )
    .state(
        {
            name: 'settings.users.edit',
            url: '/:id',
            controller: require('./users/edit.controller.js'),
            template: require('./users/users-edit.html')
        }
    )
    .state(
        {
            name: 'settings.roles',
            url: '/settings/roles',
            controller: require('./roles/roles.controller.js'),
            template: require('./roles/roles.html')
        }
    )
    .state(
        {
            name: 'settings.roles.create',
            url: '/create',
            controller: require('./roles/roles.controller.js'),
            template: require('./roles/roles-edit.html')
        }
    )
    .state(
        {
            name: 'settings.roles.edit',
            url: '/:id',
            controller: require('./roles/roles.controller.js'),
            template: require('./roles/roles-edit.html')
        }
    )
    .state(
        {
            name: 'settings.webhooks',
            url: '/settings/webhooks',
            controller: require('./webhooks/webhooks.controller.js'),
            template: require('./webhooks/webhooks.html')
        }
    )
    .state(
        {
            name: 'settings.webhooks.create',
            url: '/create',
            controller: require('./webhooks/webhooks.controller.js'),
            template: require('./webhooks/webhooks-edit.html')
        }
    )
    .state(
        {
            name: 'settings.webhooks.edit',
            url: '/:id',
            controller: require('./webhooks/webhooks.controller.js'),
            template: require('./webhooks/webhooks-edit.html')
        }
    )
    .state(
        {
            name: 'settings.datasources',
            url: '/settings/datasources',
            controller: require('./datasources/datasources.controller.js'),
            template: require('./datasources/datasources.html')
        }
    )
    .state(
        {
            name: 'settings.plan',
            url: '/settings/plan',
            controller: require('./plans/plans.controller.js'),
            template: require('./plans/plan.html')
        }
    );
}];
