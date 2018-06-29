import React from "react";
import { storiesOf } from "@storybook/react";

import Search from "./search";

storiesOf("2 Molecules/Search", module).add(
    "with heading and description",
    () => <Search />
);
