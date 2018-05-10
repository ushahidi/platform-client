import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import Link from "./Link";

test("Link accepts a route string, replace bool, id, className, title, and children", () => {
  const component = renderer.create(
    <Link to="posts.data" replace id="test" className="test" title="test">
      Click me!
    </Link>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("Link routes to new component", () => {
  const mockNavigation = jest.fn();
  const link = shallow(<Link to="posts.data">Click me!</Link>);
  link.find("a").simulate("click");
  expect(mockNavigation.mock.calls.length).toEqual(1);
});
