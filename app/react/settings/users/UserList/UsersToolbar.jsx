import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    roles: PropTypes.array.isRequired
};

const UsersToolbar = props => (
    <div className="listing-toolbar">
        <div className="listing-toolbar-summary">
            {/* /* // TODO: Add number of selected users */}
            {/*  TODO: Add deselect and select functions */}
            {/* TODO: Add dropdown functionality */}
            {/* TODO: Add delete users function */}
            {/* TODO: Disable button when no users are selected */}
            <strong />
            <button className="button-link">Deselect</button>
            <button className="button-link">Select all</button>
        </div>

        <div className="listing-toolbar-actions">
            {/* <listing-toolbar entities="users" selected-set="selectedUsers"> */}
            <fieldset className="custom-fieldset init">
                <legend className="dropdown-trigger init">
                    <span className="legend-label">user.change_role</span>
                    <svg className="iconic chevron">
                        <use
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            xlinkHref="/img/iconic-sprite.svg#chevron-bottom"
                        />
                    </svg>
                </legend>
                <div className="dropdown-menu init">
                    <div className="form-field radio">
                        {props.roles.map(role => {
                            <label>
                                <input type="radio" name="role" />
                                {role.display_name}
                            </label>;
                        })}
                    </div>
                </div>
            </fieldset>
            <button type="button" className="button-destructive">
                <svg className="iconic">
                    <use
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        xlinkHref="/img/iconic-sprite.svg#trash"
                    />
                </svg>
                <span className="button-label hidden">nav.delete</span>
            </button>
            {/* </listing-toolbar> */}
        </div>
    </div>
);
UsersToolbar.propTypes = propTypes;

export default UsersToolbar;
