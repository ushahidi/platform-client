import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import { PlainUshLogo as MyComponent } from "./ush-logo";

test("foo and bar match the props", () => {
  const forms = [{ id: "junk" }];
  const actions = {
  	receiveForms: jest.fn()
  };
  // Note that the way you pass down props in react vs. angular is different
  // Therefore you need pass down props differently
  const component = renderer.create(
    <MyComponent forms={forms} foo={1} baz={2} UshLogoActions={actions} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("MyComponent to correctly render foo and baz in p tags", () => {
  const forms = [{ id: "junk" }];
  const actions = {
  	receiveForms: jest.fn()
  };
  // Render a checkbox with label in the document
  const fooBaz = shallow(<MyComponent forms={forms} foo={4} baz={1} UshLogoActions={actions} />);

  expect(fooBaz.find("p").length).toBe(2);
  expect(fooBaz.find("p.foo").text()).toBe("Foo: 4");
  expect(fooBaz.find("p.baz").text()).toBe("Baz: 1");
});
