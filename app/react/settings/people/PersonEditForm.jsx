import React from "react";
import PropTypes from "prop-types";
import InlineLoading from "react/common/ui/InlineLoading";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";

const propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    roles: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.shape({
        REQUEST_ROLES: PropTypes.bool,
        REQUEST_PERSON: PropTypes.bool
    }).isRequired,
    hasError: PropTypes.shape({
        REQUEST_ROLES: PropTypes.shape({
            failed: PropTypes.bool,
            errorLog: PropTypes.object
        }),
        REQUEST_PERSON: PropTypes.shape({
            failed: PropTypes.bool,
            errorLog: PropTypes.object
        })
    }).isRequired,
    reset: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired
};

let PersonEditForm = props => {
    const {
        handleSubmit,
        roles,
        isLoading,
        hasError,
        // pristine,
        // submitting,
        reset
    } = props;

    const renderRoles = () => (
        <label htmlFor="role">
            Role
            <Field name="role" component="select">
                <option value="">Select a role</option>
                {roles.map(role => (
                    <option key={role.id} value={role.name}>
                        {role.display_name}
                    </option>
                ))}
            </Field>
        </label>
    );

    const route404OnError = () => {
        props.history.push("/404");
        // Need to create a new react component for this
        // Needs to accept the error message
    };

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
                {isLoading.REQUEST_ROLES ? <InlineLoading /> : renderRoles()}
                {hasError.REQUEST_ROLES && hasError.REQUEST_ROLES.failed
                    ? route404OnError()
                    : null}
                <button className="button-beta" onClick={() => reset()}>
                    Cancel
                </button>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

PersonEditForm.propTypes = propTypes;

PersonEditForm = reduxForm({
    form: "editPerson",
    enableReinitialize: true
})(PersonEditForm);

export default withRouter(PersonEditForm);
