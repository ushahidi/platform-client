import React from "react";
import { storiesOf } from "@storybook/react";

import Buttongroup from "./buttongroup";
import Button from "../../atoms/button/button";

storiesOf("2 Molecules/Buttongroup", module).add("2 buttons", () => (
    <Buttongroup>
        <Button>Button 1</Button>
        <Button buttonType="DESTRUCTIVE">Destroy it!!!</Button>
    </Buttongroup>
));
