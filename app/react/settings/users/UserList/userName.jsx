import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    user: PropTypes.object.isRequired,
    
};

const UserName = props => (
    <h2 className="listing-item-title" >
                    <a href={`/settings/users/${props.user.id}`} >{props.user.realname}</a></h2>

)

UserName.propTypes = propTypes;

export default UserName;

