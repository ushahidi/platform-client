import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import * as UsersActions from "react/common/state/users/users.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";

import { getUsers } from "react/common/state/users/users.reducers";
import { getRoles } from "react/common/state/roles/roles.reducers";
import UserAvatar from "./UserAvatar";
import UserName from "./userName";

const propTypes = {
    UsersActions: PropTypes.shape({
        requestUsers: PropTypes.func.isRequired
    }).isRequired,
    RolesActions: PropTypes.shape({
        requestRoles: PropTypes.func.isRequired
    }).isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired
};

class UserListContainer extends React.Component {
    componentDidMount() {
        this.props.UsersActions.requestUsers();
        this.props.RolesActions.requestRoles();
    }

    render() {
        return (
            <div className="main-col">
                <div className="listing card">
                    {this.props.users.length === 0 ? (
                        <div className="alert">
                            <p>
                                <em>No users available</em>
                            </p>
                        </div>
                    ) : (
                        ""
                    )}
                    {this.props.users.map(user => (
                        <div id={`user-${user.id}`} className="listing-item">
                            <div className="listing-item-select">
                                <input type="checkbox" />
                            </div>
                            <div className="listing-item-primary">
                                <UserAvatar
                                    key={user.id}
                                    realname={user.realname}
                                    avatar={user.gravatar}
                                />
                                <UserName user={user} />
                                <p className="listing-item-secondary">
                                    Role: Admin
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: getUsers(state),
        roles: getRoles(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UsersActions: bindActionCreators(UsersActions, dispatch),
        RolesActions: bindActionCreators(RolesActions, dispatch)
    };
}

UserListContainer.propTypes = propTypes;

export { UserListContainer as PlainUserListContainer };

export default connectWithStore(
    UserListContainer,
    mapStateToProps,
    mapDispatchToProps
);
