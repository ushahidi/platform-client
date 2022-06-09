import {React, useState} from "react";
import { BrowserRouter, NavLink } from "react-router-dom";
import {getSvgSprite} from '@ushahidi/utilities';

const svg = getSvgSprite();

export default function Root(props) {
    const [isMoreActive, setIsMoreActive] = useState(false);
    
    const showMore = () => {
        // toggle more state on click
        setIsMoreActive(current => !current);
    };

    const openLogin = () => {
        let event = new CustomEvent('openLogin');
        window.dispatchEvent(event);
    };
   

  return (
    <BrowserRouter basename="/">
         <div className={isMoreActive ? "mode-bar active" : "mode-bar"}>
            <nav>
                
                {/* Double-check in what element the "active" 
                class is needed to get the yellow styles for the active route */}
                <ul className="deployment-menu">
                    <li>
                        <NavLink
                            to="/views/map"
                            className="view-map"
                            activeClassName="active"
                            data-cy="mb-map-button"
                        >  
                            <svg class="iconic" role="img">
                                <use xlinkHref={`${svg}#map-marker`}></use>
                            </svg>
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
                            <svg class="iconic" role="img">
                                <use xlinkHref={`${svg}#list-rich`}></use>
                            </svg>
                            Data
                        </NavLink>
                    </li>
                    <li data-cy="mb-activity-button">
                        <NavLink
                            to="/activity"
                            className="view-activity"
                            activeClassName="active"
                        >
                            <svg class="iconic" role="img">
                                <use xlinkHref={`${svg}#pulse`}></use>
                            </svg>
                            Activity
                        </NavLink>
                    </li>
                    <li>
                        <button
                            className={isMoreActive ? "more-menu-trigger active" : "more-menu-trigger"}
                            onClick={showMore}
                        >
                            <svg class="iconic" role="img">
                                <use xlinkHref={`${svg}#ellipses`}></use>
                            </svg>
                        More
                        </button>
                        { /* In order to hide/show the settings menu and switch between 
                        logged in/logged out state, I think moving auth-handling and
                         user-info to a specific utility-module. See here: 
                        https://single-spa.js.org/docs/recommended-setup#utility-modules-styleguide-api-etc   
                        Perhaps use window.ushahidi as a middle-step while migrating?
                        */}
                        <ul>
                            <li data-message="customize" data-cy="mb-settings-button">
                                <a>
                                    <svg class="iconic" role="img">
                                        <use xlinkHref={`${svg}#cog`}></use>
                                    </svg>
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul className="account-menu">
                    <li>
                        <button data-cy="mb-collections-button">
                            <svg class="iconic">
                                <use xlinkHref={`${svg}#grid-three-up`}></use>
                            </svg>
                            <span className="label">Collections</span>
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={openLogin}
                            data-cy="mb-login-page-button">
                            <svg class="iconic" role="img">
                                <use xlinkHref={`${svg}#account-login`}></use>
                            </svg>
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
                            <svg class="iconic" role="img">
                                <use xlinkHref={`${svg}#person`}></use>
                            </svg>
                            Sign up
                        </button>
                    </li>
                    <li>
                        <button data-cy="mb-logout-button">
                            <svg class="iconic" role="img">
                                <use  xlinkHref={`${svg}#account-logout`}></use>
                            </svg>
                            <span className="label"> Log out</span>
                        </button>
                    </li>
                    <li>
                        <button data-cy="mb-ushahidi-support-button">
                            <span className="label">Support</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>     
    </BrowserRouter>);
}