import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import InlineLoading from "react/common/ui/InlineLoading";
import { Field, reduxForm } from 'redux-form'


const propTypes = {
    initialValues: PropTypes.shape({
        id: PropTypes.number
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoadingRoles: PropTypes.bool.isRequired,
    // error: PropTypes.shape({
    //     message: PropTypes.string
    // }).isRequired
};

let PersonEditForm = props => {
    const {handleSubmit, roles, isLoadingRoles, pristine, submitting} = props

    const renderRoles = () => {
        return (
            <label htmlFor="role">
                Role
                <Field
                    name="role"
                    component="select"
                >
                    <option value="">
                        Select a role
                    </option>
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>
                            {role.display_name}
                        </option>
                    ))}
                </Field>
            </label>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="realname">
                    Name
                    <Field
                        component="input"
                        type="text"
                        placeholder="What is this person's full name"
                        name="realname"
                        required
                    />
                </label>
                <label htmlFor="email">
                    Email
                    <Field
                        component="input"
                        type="text"
                        placeholder="email"
                        name="email"
                        required
                    />
                </label>
                {isLoadingRoles ? (
                    <InlineLoading />
                ) : (
                    renderRoles()
                )}
                <Link to="/settings/TODO/someplaceholderofsomekind">
                    <button className="button-beta">Cancel</button>
                </Link>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

PersonEditForm = reduxForm({
  // a unique name for the form
  form: 'editPerson',
  enableReinitialize: true
})(PersonEditForm)

export default PersonEditForm