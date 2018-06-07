import React from "react";
import { shallow } from "enzyme";
import PeopleList from "./PeopleList";

const people = [
    {
        name: "test",
        role: "admin"
    }
];
test("the render method generates 1 card when we send 1 person", () => {

    const peopleList = shallow(<PeopleList people={people} />);
    expect(peopleList.find("PersonCard").length).toBe(1);
});

test("the render method generates 1 link when we send 1 person", () => {
    const peopleList = shallow(<PeopleList people={people} />);
    expect(peopleList.find("Link").length).toBe(1);
});
