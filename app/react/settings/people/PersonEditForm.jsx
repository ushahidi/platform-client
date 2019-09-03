import React from "react";
import PropTypes from "prop-types";
import InlineLoading from "react/common/ui/InlineLoading";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import Input from "../../../../component-library/components/atoms/formelements/input/input";
import Dropdown from "../../../../component-library/components/atoms/formelements/dropdown/dropdown";
import Label from "../../../../component-library/components/atoms/formelements/label/label";
import Button from "../../../../component-library/components/atoms/button/button";
import FormField from "../../../../component-library/components/molecules/formfields/formfield";

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
        <Label htmlFor="role">
            Role
            <Field
                name="role"
                component={Dropdown}
                options={roles}
                defaultString="Select a role"
            />
        </Label>
    );

    const route404OnError = () => {
        props.history.push("/404");
        // Need to create a new react component for this
        // Needs to accept the error message
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <Label htmlFor="realname">
                        Name
                        <Field
                            component={Input}
                            type="text"
                            placeholder="What is this person's full name"
                            name="realname"
                            required
                        />
                    </Label>
                </FormField>
                <FormField>
                    <Label htmlFor="email">
                        Email
                        <Field
                            component={Input}
                            type="text"
                            placeholder="email"
                            name="email"
                            required
                        />
                    </Label>
                </FormField>
                <FormField>
                    {isLoading.REQUEST_ROLES ? (
                        <InlineLoading />
                    ) : (
                        renderRoles()
                    )}
                </FormField>
                {hasError.REQUEST_ROLES && hasError.REQUEST_ROLES.failed
                    ? route404OnError()
                    : null}
                <Button className="button-beta" onClick={() => reset()}>
                    Cancel
                </Button>
                <Button type="submit">Submit</Button>
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
