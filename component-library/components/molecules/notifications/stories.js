import React from "react";
import { storiesOf } from "@storybook/react";

import Notifications from "./notifications";

storiesOf("2 Molecules/Notifications", module)
    .add("neutral", () => (
        <Notifications notificationType="NEUTRAL">
            This is a neutral message.
        </Notifications>
    ))
    .add("success", () => (
        <Notifications notificationType="SUCCESS">
            We did the thing!
        </Notifications>
    ))
    .add("error", () => (
        <Notifications notificationType="ERROR">
            There was a problem doing the thing.
        </Notifications>
    ));
