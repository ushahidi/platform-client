import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    role: PropTypes.string.isRequired
};

const CheckBox = props => (
    <p className="listing-item">
    <a href={`/settings/users/${props.user.id}`}>{props.user.realname}</a>
    </p>
);
   

CheckBox.propTypes = propTypes;

export default CheckBox;