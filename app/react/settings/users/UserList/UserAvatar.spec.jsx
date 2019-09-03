import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import UserAvatar from "./UserAvatar";

test("it renders the users avatar if it is available", () => {
    const avatar = "58dd1606bc6bd9d28f57b61cb705ff3a";
    const realname = "Test";
    const component = renderer.create(
        <UserAvatar avatar={avatar} realname={realname} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
test("it renders the default gravatar-id if user-avatar is not available", () => {
    const realname = "Test";
    const component = renderer.create(<UserAvatar realname={realname} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
test("the url for the avatar is using the user avatar prop if it is available", () => {
    const avatar = "58dd1606bc6bd9d28f57b61cb705ff3a";
    const realname = "Test";
    const userAvatar = shallow(
        <UserAvatar avatar={avatar} realname={realname} />
    );
    expect(userAvatar.find("img").prop("src")).toEqual(
        `https://www.gravatar.com/avatar/${avatar}?d=retro`
    );
});
test("the url for the avatar is using the avatar prop if it is available", () => {
    const defaultGravatar = "00000000000000000";
    const realname = "Test";
    const userAvatar = shallow(<UserAvatar realname={realname} />);
    expect(userAvatar.find("img").prop("src")).toEqual(
        `https://www.gravatar.com/avatar/${defaultGravatar}?d=retro`
    );
});

test("the realname prop is used as alt-value ", () => {
    const realname = "Test";
    const userAvatar = shallow(<UserAvatar realname={realname} />);
    expect(userAvatar.find("img").prop("alt")).toEqual(realname);
});
