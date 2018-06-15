import React from "react";

const PeopleNavigationContainer = () => (
    <div className="mode-context init">
        <header className="mode-context-header">
            <ol className="breadcrumbs">
                <li>
                    <a href="/" ng-controller="navigation as nav">
                        nav.site.name
                    </a>
                </li>
                <li>
                    <a href="/settings" translate>
                        app.settings
                    </a>
                </li>
            </ol>
            <h1 className="mode-context-title" translate>
                app.users
            </h1>
        </header>
    </div>
);
export default PeopleNavigationContainer;
