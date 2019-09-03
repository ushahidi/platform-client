import React from "react";
import { storiesOf } from "@storybook/react";

import Breadcrumbs from "./breadcrumbs";

storiesOf("2 Molecules/Breadcrumbs", module).add("breadcrumbs", () => (
    <Breadcrumbs
        navigation={[
            { path: "/parent", name: "Parent Page" },
            { path: "/parent/page", name: "Page" }
        ]}
    />
));
