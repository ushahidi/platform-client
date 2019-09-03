import React from "react";
import { shallow } from "enzyme";
import { DisconnectedPeopleListContainer as PeopleListContainer } from "./PeopleListContainer";

test("the handleChange method updates the input value", () => {
    const fnPeople = {
        fetchPeople: jest.fn()
    };
    const peopleListContainer = shallow(
        <PeopleListContainer PeopleActions={fnPeople} />
    );
    expect(peopleListContainer.find("PeopleNavigationContainer").length).toBe(
        1
    );
    expect(peopleListContainer.find("PeopleToolbarContainer").length).toBe(1);
    expect(peopleListContainer.find("SettingsSearch").length).toBe(1);

    expect(peopleListContainer.find("PeopleList").length).toBe(1);
});
