import React from "react";
import { shallow } from "enzyme";
import PeopleNavigationContainer from "./PeopleNavigationContainer";

test("the render method shows the correct html", () => {
    const peopleNavigationContainer = shallow(<PeopleNavigationContainer />);
    expect(peopleNavigationContainer.find("header").length).toBe(1);
    expect(peopleNavigationContainer.find("ol").length).toBe(1);
    expect(peopleNavigationContainer.find("h1").length).toBe(1);
});
