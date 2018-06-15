import React from "react";
import { shallow } from "enzyme";
import PersonCard from "./PersonCard";

const person = {
    id: 12,
    realname: "test",
    role: "admin",
    gravatar: "1234"
};

test("It should render a link to the person edit form", () => {
    const personCard = shallow(<PersonCard person={person} />);
    expect(personCard.find("Link").prop("to")).toBe("/settings/usersEdit/12");
});

test("It should render the person-name", () => {
    const personCard = shallow(<PersonCard person={person} />);
    expect(personCard.find("h2").text()).toBe("test");
});

test("It should render the person-role", () => {
    const personCard = shallow(<PersonCard person={person} />);
    expect(personCard.find("p").text()).toBe("Role: admin");
});

test("It should render the person-gravatar", () => {
    const personCard = shallow(<PersonCard person={person} />);
    expect(personCard.find("img").length).toBe(1);
    expect(personCard.find("img").prop("src")).toEqual(
        `https://www.gravatar.com/avatar/${person.gravatar}?d=retro`
    );
});
