import React from "react";
import PropTypes from "prop-types";

const propTypes = {
    avatar: PropTypes.string,
    realname: PropTypes.string.isRequired
};
const defaultProps = {
    avatar: "00000000000000000"
};

const UserAvatar = props => (
    <div className="listing-item-image">
        <img
            className="avatar"
            src={`https://www.gravatar.com/avatar/${props.avatar}?d=retro`}
            alt={props.realname}
        />
    </div>
);

UserAvatar.propTypes = propTypes;
UserAvatar.defaultProps = defaultProps;

export default UserAvatar;
