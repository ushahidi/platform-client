import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import * as UsersActions from "react/common/state/users/users.actions";

import { getUsers } from "react/common/state/users/users.reducers";
import UserAvatar from "./UserAvatar";

const propTypes = {
    UsersActions: PropTypes.shape({
        requestUsers: PropTypes.func.isRequired
    }).isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired
};

class UserListContainer extends React.Component {
    componentDidMount() {
        this.props.UsersActions.requestUsers();
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
                        <UserAvatar
                            key={user.id}
                            realname={user.realname}
                            avatar={user.gravatar}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: getUsers(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UsersActions: bindActionCreators(UsersActions, dispatch)
    };
}

UserListContainer.propTypes = propTypes;

export { UserListContainer as PlainUserListContainer };

export default connectWithStore(
    UserListContainer,
    mapStateToProps,
    mapDispatchToProps
);
