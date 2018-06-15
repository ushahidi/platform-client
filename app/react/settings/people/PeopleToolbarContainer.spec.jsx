import React from "react";
import { shallow } from "enzyme";
import PeopleToolbarContainer from "./PeopleToolbarContainer";

test("It should render a link to the person edit form", () => {
    const peopleToolbarContainer = shallow(<PeopleToolbarContainer />);
    expect(peopleToolbarContainer.find("Link").prop("to")).toBe(
        "settings/usersCreate"
    );
    expect(peopleToolbarContainer.find("div").length).toBe(3);
    expect(peopleToolbarContainer.find("div.toolbar").length).toBe(1);
});
