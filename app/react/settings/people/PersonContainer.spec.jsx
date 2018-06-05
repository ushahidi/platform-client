import React from "react";
import { shallow } from "enzyme";
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
    const personContainer = shallow(<PersonContainer {...props} />);

    expect(personContainer.find("h3").length).toBe(1);
    expect(personContainer.find("p").length).toBe(1);
});
