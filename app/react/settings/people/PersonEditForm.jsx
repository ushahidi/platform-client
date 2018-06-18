import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import InlineLoading from "react/common/ui/InlineLoading";

const propTypes = {
    person: PropTypes.shape({
        id: PropTypes.number.isRequired
    }),
    updatePerson: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoadingRoles: PropTypes.bool.isRequired
    // error: PropTypes.shape({
    //     message: PropTypes.string
    // }).isRequired
};

const defaultProps = {
    person: undefined
};

class PersonEditForm extends React.Component {
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

    handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const person = Object.assign({}, this.state);
        this.props.saveNewPerson(person);
        // after success, clear state
        // after failure, state remains
        // TBD after we figure out endpoints
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
                    <h3>Add Contact</h3>
                    <p>
                        Add members of your team, stakeholders, and other
                        members of your community to Ushahidi.
                    </p>
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
                    <Link to="/settings/TODO/someplaceholderofsomekind">
                        <button className="button-beta">Cancel</button>
                    </Link>
                    <button type="submit">Submit</button>
                </form>
            </main>
        );
    }
}

PersonEditForm.propTypes = propTypes;
PersonEditForm.defaultProps = defaultProps;

export default PersonEditForm;
