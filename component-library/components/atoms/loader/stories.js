import React from "react";
import { storiesOf } from "@storybook/react";

import Loader from "./loader";

storiesOf("1 Atoms/Loaders", module)
    .add("default", () => <Loader loaderType="LOADER" />)
    .add("alt", () => <Loader loaderType="ALT" />);
