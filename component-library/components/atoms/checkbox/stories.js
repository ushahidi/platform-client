import React from "react";
import { storiesOf } from "@storybook/react";

import Checkbox from "./checkbox";

storiesOf("1 Atoms/Checkbox", module)
    .add("checkbox", () => (
        <Checkbox checkType="CHECKBOX" id="a">
            Learn more
        </Checkbox>
    ))
    .add("radiobutton", () => (
        <Checkbox checkType="RADIO" id="b">
            Learn more
        </Checkbox>
    ));
