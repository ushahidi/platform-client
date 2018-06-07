import React from "react";
import { Link, Redirect, BrowserRouter } from "react-router-dom";
import PropTypes from "prop-types";
import InlineLoading from "react/common/ui/InlineLoading";
// import Router from "react-router";

const propTypes = {
    saveNewPerson: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoadingRoles: PropTypes.bool.isRequired
    // error: PropTypes.shape({
    //     message: PropTypes.string
    // }).isRequired
};

class PersonCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                email: "howcomethisgoesaway",
                password: "",
                realname: "",
                role: { display_name: "Select a role", name: "" }
            },
            redirectToPeopleList: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.renderRoles = this.renderRoles.bind(this);
    }

    handleChange(event) {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.id]: event.target.value
            }
        });
    }

    handleOptionChange(event) {
        this.setState({
            form: {
                ...this.state.form,
                [event.target.id]: {
                    display_name: event.target.value,
                    name: event.target.id
                }
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const person = Object.assign({}, this.state.form);

        // TODO: do this in a cool ES6 way
        person.role = this.state.form.role.name;
        this.props.saveNewPerson(person).then(() => {
            this.setState(() => ({
                redirectToPeopleList: true,
                form: {}
            }));
        });
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
                    value={this.state.form.role.display_name}
                    onChange={this.handleOptionChange}
                >
                    <option
                        id="default"
                        value={this.state.form.role.display_name}
                    >
                        {this.state.form.role.display_name}
                    </option>
                    {this.props.roles
                        .filter(
                            item =>
                                item.display_name !==
                                this.state.form.role.display_name
                        )
                        .map(role => (
                            <option
                                key={role.id}
                                id={role.name}
                                value={role.display_name}
                            >
                                {role.display_name}
                            </option>
                        ))}
                </select>
            </label>
        );
    }

    render() {
        if (this.state.redirectToPeopleList === true) {
            return <Redirect to="/settings/users" />;
        }

        return (
            <BrowserRouter>
                <main role="main">
                    <div>
                        <h3>Add people to Ushahidi</h3>
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
                                value={this.state.form.realname}
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
                                value={this.state.form.email}
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
                                value={this.state.form.password}
                                onChange={this.handleChange}
                                required
                            />
                        </label>
                        {this.props.isLoadingRoles ? (
                            <InlineLoading />
                        ) : (
                            this.renderRoles()
                        )}
                        <Link to="/settings/users">
                            <button className="button-beta">Cancel</button>
                        </Link>
                        <button type="submit">Submit</button>
                    </form>
                </main>
            </BrowserRouter>
        );
    }
}

PersonCreateForm.propTypes = propTypes;

export default PersonCreateForm;
