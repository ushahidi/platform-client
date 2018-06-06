import React from "react";
import { shallow } from "enzyme";
import PersonCard from "./PersonCard";

const person = {
    realname: "test",
    role: "admin"
};

test("It should render the person-name", () => {
    const personCard = shallow(<PersonCard person={person} />);
    expect(personCard.find("h3").text()).toBe("test");
});

test("It should render the person-role", () => {
    const personCard = shallow(<PersonCard person={person} />);
    expect(personCard.find("p").text()).toBe("admin");
});
