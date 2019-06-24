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
import UserRole from "./UserRole";
import CheckBox from "./Checkbox.jsx";
import UsersToolbar from "./usersToolbar.jsx";

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
        console.log(this.props.roles)
        return (
            <div className="main-col">
                {/* TODO: Make the toolbar visible when users are selected */}
                <div className="listing card toolbar-active">
                    <UsersToolbar
                        roles={this.props.roles}
                    />
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
                            <CheckBox userId={user.id} />
                            <div className="listing-item-primary">
                            <UserAvatar
                                        key={user.id}
                                        realname={user.realname}
                                        avatar={user.gravatar}
                                    />
                                <div className="listing-item">
                                    <UserName user={user} />
                                    <UserRole role="admin" />
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
//  {Start from here}
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
