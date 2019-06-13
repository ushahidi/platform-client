import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    role: PropTypes.string.isRequired
};

const UserRole = props => (
    <p class="listing-item-secondary">Role: {props.role}</p>
    // <h2 className="listing-item-secondary">
    //     <a href={`/settings/users/${props.user.role}`}>{props.user.realname}</a>
    // </h2>
);

UserRole.propTypes = propTypes;

export default UserRole;
