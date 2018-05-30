import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import UserForm from "./UserForm";

test("a User Form with roles displays roles correctly", () => {
    const saveNewUser = () => {};
    const roles = [{ id: "email", name: "email" }];
    const isLoadingRoles = false;
    const component = renderer.create(
        <UserForm
            saveNewUser={saveNewUser}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
        />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("A User Form without roles displays loading instead", () => {
    const saveNewUser = () => {};
    const roles = [];
    const isLoadingRoles = true;
    const component = renderer.create(
        <UserForm
            saveNewUser={saveNewUser}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
        />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("the handleChange method updates the input value", () => {
    const saveNewUser = () => {};
    const roles = [{ id: "email", name: "email" }];
    const isLoadingRoles = false;

    const userForm = shallow(
        <UserForm
            saveNewUser={saveNewUser}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
        />
    );

    expect(userForm.find('[id="realname"]').props().value).toBe("");
    const realname = userForm.find('[id="realname"]');
    realname.simulate("change", {
        target: { value: "My real name", id: "realname" }
    });
    expect(userForm.find('[id="realname"]').props().value).toBe("My real name");
});

// test for submit success

// test for submit error
