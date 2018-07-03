/* we don't need to use this navbar until we migrate it.
* This is just a start. HTML is right now rendered in angular */
import * as React from "react";

import Icon from "../../atoms/icon/icon";

const Navbar = () => (
    <div className="mode-bar">
        <nav>
            <ul className="deployment-menu">
                <li>
                    <Icon icon="MAP_MARKER" />
                    <a href="/map">Map</a>
                </li>

                <li>
                    <Icon icon="LIST_RICH" />
                    <a href="/data">Data</a>
                </li>

                <li>
                    <Icon icon="PULSE" />
                    <a href="/activity">Activity</a>
                </li>

                <li className="active">
                    <Icon icon="COG" />
                    <a href="/settings">Settings</a>
                </li>

                <li className="more-menu-trigger">
                    <a href="/more" className="more-menu-trigger">
                        <Icon icon="ELLIPSES" />
                        More
                    </a>
                </li>
            </ul>

            <ul className="account-menu">
                <li>
                    <Icon icon="GRID_THREE_UP" />
                    <a href="/collections">Collections</a>
                </li>
                <li>
                    <Icon icon="ACCOUNT_LOGIN" />
                    <a href="/login">Login</a>
                </li>
                <li>
                    <Icon icon="ACCOUNT_LOGOUT" />
                    <a href="/signup">Register</a>
                </li>
                <li>
                    <Icon icon="QUESTION_MARK" />
                    <a href="https://www.ushahidi.com/support">Support</a>
                </li>

                <li className="made-by-logo">
                    <a href="http://ushahidi.com">
                        {/* <img src="/img/ushahidi-logo.png" alt="Ushahidi Logo" /> */}
                        <span>Made by Ushahidi</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
);

export default Navbar;
