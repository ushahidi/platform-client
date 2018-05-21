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
import InlineLoading from "react/common/ui/InlineLoading";

class UserContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            realname: "",
            role: "Select a role"
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderRoles = this.renderRoles.bind(this);
    }

    componentDidMount() {
        // Need UI to handle failures for this.
        // Error currently saved to state.error
        this.props.RolesActions.requestRoles();
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = Object.assign({}, this.state);
        this.props.UsersActions.saveNewUser(user);
    }

    handleChange(event) {
        // create a case and match it to the element id, update state accordingly
        switch (event.target.id) {
            case "email":
                this.setState({ email: event.target.value });
                break;
            case "password":
                this.setState({ password: event.target.value });
                break;
            case "realname":
                this.setState({ realname: event.target.value });
                break;
            case "role":
                this.setState({ role: event.target.value });
                break;
            default:
                return null;
        }
        return null;
    }

    renderRoles() {
        return (
            <label htmlFor="role">
                Role
                <select
                    id="role"
                    value={this.state.role}
                    onChange={this.handleChange}
                >
                    <option id="default" value={this.state.role}>
                        {this.state.role}
                    </option>
                    {this.props.roles.map(role => (
                        <option key={role.id} id={role.name}>
                            {role.display_name}
                        </option>
                    ))}
                </select>
            </label>
        );
    }

    render() {
        return (
            <main role="main">
                <div>
                    <h2>Add people to Ushahidi</h2>
                    <p>Add members of your team, etc.. etc...</p>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="realname">
                        Name
                        <input
                            type="text"
                            placeholder="What is this person's full name"
                            id="realname"
                            value={this.state.realname}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="email">
                        Email
                        <input
                            type="text"
                            placeholder="email"
                            id="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="password">
                        Password
                        <input
                            type="password"
                            placeholder="password"
                            id="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    {this.props.isLoadingRoles ? (
                        <InlineLoading />
                    ) : (
                        this.renderRoles()
                    )}
                    <button type="submit">Submit</button>
                </form>
                <div />
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

UserContainer.propTypes = {
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

export { UserContainer as PlainUserContainer };

export default connectWithStore(
    UserContainer,
    mapStateToProps,
    mapDispatchToProps
);
