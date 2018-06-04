import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import PersonForm from "./PersonForm";

test("a Person Form with roles displays roles correctly", () => {
    const saveNewPerson = () => {};
    const roles = [{ id: "email", name: "email" }];
    const isLoadingRoles = false;
    const component = renderer.create(
        <PersonForm
            saveNewPerson={saveNewPerson}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
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
        <PersonForm
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

    const personForm = shallow(
        <PersonForm
            saveNewPerson={saveNewPerson}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
        />
    );

    expect(personForm.find('[id="realname"]').props().value).toBe("");
    const realname = personForm.find('[id="realname"]');
    realname.simulate("change", {
        target: { value: "My real name", id: "realname" }
    });
    expect(personForm.find('[id="realname"]').props().value).toBe("My real name");
});

// test for submit success

// test for submit error
