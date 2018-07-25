import React from "react";
import { storiesOf } from "@storybook/react";

import Icon from "./icon";

storiesOf("1 Atoms/Icons", module)
    .add("magnifyingGlass", () => <Icon icon="MAGINFYING_GLASS" />)
    .add("warning", () => <Icon icon="WARNING" />)
    .add("check", () => <Icon icon="CHECK" />)
    .add("circleX", () => <Icon icon="CIRCLE_X" />);
