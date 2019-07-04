import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import * as UsersActions from "react/common/state/users/users.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";

import { getUsers } from "react/common/state/users/users.reducers";
import { getRoles } from "react/common/state/roles/roles.reducers";
import UserAvatar from "./UserAvatar";
import UserName from "./UserName";
import UserRole from "./UserRole";
import CheckBox from "./Checkbox.jsx";
import UsersToolbar from "./UsersToolbar.jsx";
import { getSelectedUsers } from "../../../common/state/users/users.reducers";

const propTypes = {
    UsersActions: PropTypes.shape({
        requestUsers: PropTypes.func.isRequired,
        toggleUser: PropTypes.func.isRequired,
         toggleAll: PropTypes.func.isRequired
    }).isRequired,
    RolesActions: PropTypes.shape({
        requestRoles: PropTypes.func.isRequired
    }).isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedUsers: PropTypes.arrayOf(PropTypes.string).isRequired
};

class UserListContainer extends React.Component {
    componentDidMount() {
        this.props.UsersActions.requestUsers();
        this.props.RolesActions.requestRoles();
    }

    render() {
        console.log(this.props.selectedUsers)
        return (
            <div className="main-col">
                {/* adding class "toolbar-active" if there are selected users */}
                <div
                    className={`listing card ${
                        this.props.selectedUsers.length > 0
                            ? "toolbar-active"
                            : ""
                    }`}
                >
                    <UsersToolbar handleChange={this.props.UsersActions.toggleAll} roles={this.props.roles} />
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
                        <div
                            id={`user-${user.id}`}
                            key={user.id}
                            className="listing-item"
                        >
                            {/* Sending the toggleUser action as a prop to the checkbox with handleChange */}
                            <CheckBox
                                userId={user.id}
                                handleChange={
                                    this.props.UsersActions.toggleUser
                                }
                                checked={
                                    this.props.selectedUsers.indexOf(
                                        user.id
                                    ) !== -1
                                }
                            />
                            
                            <div className="listing-item-primary">
                                <UserAvatar
                                    key={user.id}
                                    realname={user.realname}
                                    avatar={user.gravatar}
                                />
                                <UserName user={user} />
                                <UserRole userRole="admin" />
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
        roles: getRoles(state),
        selectedUsers: getSelectedUsers(state)
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
