import React from "react";
import { shallow } from "enzyme";
import PeopleList from "./PeopleList";

const people = [
    {
        id: 1,
        name: "test",
        role: "admin"
    }
];

const people2 = [
    {
        id: 1,
        name: "test",
        role: "admin"
    },
    {
        id: 2,
        name: "test2",
        role: "admin2"
    }
];
test("the render method generates 1 card when we send 1 person", () => {
    const peopleList = shallow(<PeopleList people={people} />);
    expect(peopleList.find("PersonCard").length).toBe(1);
});

test("the render method generates 2 cards when we send 2 people", () => {
    const peopleList = shallow(<PeopleList people={people2} />);
    expect(peopleList.find("PersonCard").length).toBe(2);
});
