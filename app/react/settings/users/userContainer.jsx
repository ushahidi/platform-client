import React from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import connectWithStore from "react/react-transition/connectWithStore";
import * as UsersActions from "react/common/state/users/users.actions";
import * as RolesActions from "react/common/state/roles/roles.actions";
import {
    isLoadingRoles,
    getRoles
    // getRoleError
} from "react/common/state/roles/roles.reducers";
import { getUsers } from "react/common/state/users/users.reducers";
import UserForm from "react/settings/users/UserForm";

const propTypes = {
    UsersActions: PropTypes.shape({
        saveNewUser: PropTypes.func.isRequired
    }).isRequired,
    RolesActions: PropTypes.shape({
        requestRoles: PropTypes.func.isRequired
    }).isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoadingRoles: PropTypes.bool.isRequired
    // error: PropTypes.shape({
    //     message: PropTypes.string
    // }).isRequired
};

class UserContainer extends React.Component {
    componentDidMount() {
        // Need UI to handle failures for this.
        // Error currently saved to state.error
        this.props.RolesActions.requestRoles();
    }

    render() {
        return (
            <main role="main">
                <div>
                    <h2>Add people to Ushahidi</h2>
                    <p>
                        Add members of your team, beneficiaries, and other
                        members of your community to Ushahidi
                    </p>
                </div>
                <UserForm
                    saveNewUser={this.props.UsersActions.saveNewUser}
                    roles={this.props.roles}
                    isLoadingRoles={this.props.isLoadingRoles}
                />
            </main>
        );
    }
}

function mapStateToProps(state) {
    return {
        users: getUsers(state),
        roles: getRoles(state),
        isLoadingRoles: isLoadingRoles(state)
        // error: getRoleError(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UsersActions: bindActionCreators(UsersActions, dispatch),
        RolesActions: bindActionCreators(RolesActions, dispatch)
    };
}

UserContainer.propTypes = propTypes;

export { UserContainer as PlainUserContainer };

export default connectWithStore(
    UserContainer,
    mapStateToProps,
    mapDispatchToProps
);
