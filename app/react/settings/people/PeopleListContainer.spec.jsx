import React from "react";
import { shallow } from "enzyme";
import { DisconnectedPeopleListContainer as PeopleListContainer } from "./PeopleListContainer";

test("the handleChange method updates the input value", () => {
    const peopleListContainer = shallow(<PeopleListContainer />);

    expect(peopleListContainer.find("button").length).toBe(1);
    expect(peopleListContainer.find("button").text()).toBe("Add a person");
    expect(peopleListContainer.find("SettingsSearch").length).toBe(1);
    expect(peopleListContainer.find("PeopleList").length).toBe(1);
});
