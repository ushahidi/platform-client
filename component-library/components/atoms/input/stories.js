import React from "react";
import { storiesOf } from "@storybook/react";

import Input from "./input";

storiesOf("Input", module)
    .add("input, text", () => (
        <Input inputType="TEXT" placeholder="Just a normal input-box" />
    ))
    .add("input, email", () => (
        <Input inputType="EMAIL" placeholder="E.g general@ushahidi.com" />
    ))
    .add("input, password", () => (
        <Input inputType="PASSWORD" placeholder="Type your password" />
    ))
    .add("input, search", () => (
        <Input inputType="SEARCH" placeholder="Search" />
    ))
    .add("input, error", () => (
        <Input inputType="TEXT" className="error" placeholder="Search" />
    ))
    .add("input, disabled", () => (
        <Input inputType="TEXT" disabled placeholder="Search" />
    ));
