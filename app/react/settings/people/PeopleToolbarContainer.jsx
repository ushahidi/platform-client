import React from "react";
import Link from "../../react-transition/Link";

const PeopleToolbarContainer = () => (
    <div className="toolbar">
        <div className="fab">
            <Link
                to="settings/usersCreate"
                className="button button-alpha button-fab"
                type="button"
            >
                +
            </Link>
        </div>
        <div className="button-group">
            <button type="button">
                <span className="button-label">nav.export</span>
            </button>
        </div>
    </div>
);
export default PeopleToolbarContainer;
// TODO before PR/merge: resolve iconic include with <Icon> component, or create ticket to handle it
