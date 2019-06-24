import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    userRole: PropTypes.string.isRequired
};

const UserRole = props => (
    <p className="listing-item-secondary">Role: {props.userRole}</p>
);

UserRole.propTypes = propTypes;

export default UserRole;
