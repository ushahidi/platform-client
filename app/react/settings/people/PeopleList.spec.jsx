import React from "react";
import { shallow } from "enzyme";
import PeopleList from "./PeopleList";

test("the render method generates 1 card when we send 1 person", () => {
    const people = [
        {
            name: "test",
            role: "admin"
        }
    ];
    const peopleList = shallow(<PeopleList people={people} />);
    expect(peopleList.find("PersonCard").length).toBe(1);
});
