import React from "react";
import { BrowserRouter, NavLink } from "react-router-dom";
export default function Root(props) {
  return (
<BrowserRouter basename="/">
    <div>
        <ul className="deployment-menu">
            <li>
                <NavLink
                    to="/views/map"
                    className="view-map"
                    activeClassName="active"
                    data-cy="mb-map-button"
                > 
                    Map
                </NavLink>
            </li>
            <li>
                <NavLink
                    to="/views/data"
                    className="view-data"
                    activeClassName="active"
                    data-cy="mb-data-button"
                >
                    Data
                </NavLink>
            </li>
            <li data-cy="mb-activity-button">
                <NavLink
                    to="/activity"
                    className="view-activity"
                    activeClassName="active"
                >
                    Activity
                </NavLink>
            </li>
            <li>
                <button className="more-menu-trigger">
                    More
                </button>
                <ul>
                    <li data-message="customize" data-cy="mb-settings-button">
                        <a>
                            Settings
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
        <ul className="account-menu">
            <li>
                <button data-cy="mb-collections-button">
                    <span className="label">Collections</span>
                </button>
            </li>
            <li>
                <button data-cy="mb-login-page-button">
                    Log in
                </button>
            </li>
            <li>
                <button data-cy="mb-account-settings-button">
                    <span>Account Settings</span>
                </button>
            </li>
            <li>
                <button data-cy="mb-signup-page-button">
                    Sign up
                </button>
            </li>
            <li>
                <button data-cy="mb-logout-button">
                    <span className="label"> Log out</span>
                </button>
            </li>
            <li>
                <button data-cy="mb-ushahidi-support-button">
                    <span className="label">Support</span>
                </button>
            </li>
        </ul>
    </div>        
</BrowserRouter>);
}