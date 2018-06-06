import React from "react";
import { MemoryRouter } from 'react-router'
import { mount } from "enzyme";
import { DisconnectedPersonContainer as PersonContainer } from "./PersonContainer";

// THIS DOESN'T ACTUALLY TEST ANYTHING!!!!
// WHEN WE HAVE LOCATION, FIX ME!!!
test("The PersonContainer has an title and some text when in /create", () => {
    const props = {
        PeopleActions: {
            saveNewPerson: jest.fn()
        },
        RolesActions: {
            requestRoles: jest.fn()
        },
        roles: [{}],
        isLoadingRoles: false
    };
    const personContainer = mount(
        <MemoryRouter initalEntries = {['/settings/users/create']}>
            <PersonContainer {...props} />
        </MemoryRouter>
    );
    console.log(personContainer.debug())
    expect(personContainer.find("PersonContainer").length).toBe(1);
});
