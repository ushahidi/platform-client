import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import PersonCreateForm from "./PersonCreateForm";

test("a Person Form with roles displays roles correctly", () => {
    const saveNewPerson = () => {};
    const roles = [{ id: "email", name: "email" }];
    const isLoading = {REQUEST_ROLES: false};
    const component = renderer.create(
        <PersonCreateForm
            saveNewPerson={saveNewPerson}
            roles={roles}
            isLoading={isLoading}
        />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("A Person Form without roles displays loading instead", () => {
    const saveNewPerson = () => {};
    const roles = [];
    const isLoadingRoles = true;
    const component = renderer.create(
        <PersonCreateForm
            saveNewPerson={saveNewPerson}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
        />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("the handleChange method updates the input value", () => {
    const saveNewPerson = () => {};
    const roles = [{ id: "email", name: "email" }];
    const isLoadingRoles = false;

    const personCreateForm = shallow(
        <PersonCreateForm
            saveNewPerson={saveNewPerson}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
        />
    );

    expect(personCreateForm.find('[id="realname"]').props().value).toBe("");
    const realname = personCreateForm.find('[id="realname"]');
    realname.simulate("change", {
        target: { value: "My real name", id: "realname" }
    });
    expect(personCreateForm.find('[id="realname"]').props().value).toBe(
        "My real name"
    );
});

// test for submit success

// test for submit error
