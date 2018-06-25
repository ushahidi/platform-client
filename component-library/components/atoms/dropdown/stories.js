import React from "react";
import { storiesOf } from "@storybook/react";

import Dropdown from "./dropdown";

const options = [
    { value: "test-1", name: "Test 1" },
    { value: "test-2", name: "Test 2" },
    { value: "test-3", name: "Test 3" }
];

const optionsWithLabel = [
    { value: "", name: "Select something" },
    { value: "test-1", name: "Test 1" },
    { value: "test-2", name: "Test 2" },
    { value: "test-3", name: "Test 3" }
];

storiesOf("Dropdown", module)
    .add("dropdown, default", () => <Dropdown options={options} />)
    .add("dropdown, disabled", () => <Dropdown options={options} disabled />)
    .add("dropdown, with label", () => <Dropdown options={optionsWithLabel} />);
