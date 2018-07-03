import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Button from "./button";

storiesOf("1 Atoms/Button", module)
    .add("default", () => (
        <Button buttonType="BUTTON" onClick={action("clicked")}>
            Learn more
        </Button>
    ))
    .add("beta", () => (
        <Button buttonType="BETA" onClick={action("clicked")}>
            Learn more
        </Button>
    ))
    .add("gamma", () => (
        <Button buttonType="GAMMA" onClick={action("clicked")}>
            Learn more
        </Button>
    ))
    .add("destructive", () => (
        <Button buttonType="DESTRUCTIVE" onClick={action("clicked")}>
            Learn more
        </Button>
    ))
    .add("default, disabled", () => (
        <Button buttonType="BUTTON" disabled onClick={action("clicked")}>
            Learn more
        </Button>
    ))
    .add("beta, disabled", () => (
        <Button buttonType="BETA" disabled onClick={action("clicked")}>
            Learn more
        </Button>
    ));
