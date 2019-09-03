import React from "react";
import { storiesOf } from "@storybook/react";

import ListItem from "../../molecules/listitem/listitem";
import FormField from "../../molecules/formfields/formfield";
import Fieldset from "../../molecules/formfields/fieldset";
import Label from "../../atoms/formelements/label/label";

storiesOf("1 Atoms/Typography/Headings", module)
    .add("h1", () => <h1>This is heading 1</h1>)
    .add("h2", () => <h2>This is heading 2</h2>)
    .add("h3", () => <h3>This is heading 3</h3>)
    .add("h4", () => <h4>This is heading 4</h4>)
    .add("All headings together", () => (
        <div>
            <h1>This is heading 1</h1>
            <br />
            <h2>This is heading 2</h2>
            <br />
            <h3>This is heading 3</h3>
            <br />
            <h4>This is heading 4</h4>
        </div>
    ));

storiesOf("1 Atoms/Typography/content", module)
    .add("p", () => (
        <p>
            Vertical backside hack slash stuffs the rail goes vertical shaka,
            air section coffee poor monsters. Bottomed out rip, sand bottom over
            the reef rookie pigdog pose on the nose, closeout carves
            tomb-stoning. Wall clean best section set wave sandbar digs rail
            Jeffreys Bay. Ridin the foam ball rank set wave wrap, ice cream
            headaches. Sick Owen Wright rookie, wonky rail power hack surfline
            turds in the lineup. Backdoor lined up beat it kook cutback amped
            digs rail. Making the bottom turn tail click cutback precise wave
            Jamie OBrien late frothy top drainer twin keel.
        </p>
    ))
    .add("content in list-items", () => (
        <ListItem>
            <h3>This is heading 3 in a list</h3>
            <p>
                Vertical backside hack slash stuffs the rail goes vertical
                shaka, air section coffee poor monsters. Bottomed out rip, sand
                bottom over the reef rookie pigdog pose on the nose, closeout
                carves tomb-stoning. Wall clean best section set wave sandbar
                digs rail Jeffreys Bay. Ridin the foam ball rank set wave wrap,
                ice cream headaches. Sick Owen Wright rookie, wonky rail power
                hack surfline turds in the lineup. Backdoor lined up beat it
                kook cutback amped digs rail. Making the bottom turn tail click
                cutback precise wave Jamie OBrien late frothy top drainer twin
                keel.
            </p>
        </ListItem>
    ))
    .add("formfield", () => (
        <FormField>
            <h3>This is heading 3 in a formfield</h3>
            <p>
                Vertical backside hack slash stuffs the rail goes vertical
                shaka, air section coffee poor monsters. Bottomed out rip, sand
                bottom over the reef rookie pigdog pose on the nose, closeout
                carves tomb-stoning. Wall clean best section set wave sandbar
                digs rail Jeffreys Bay. Ridin the foam ball rank set wave wrap,
                ice cream headaches. Sick Owen Wright rookie, wonky rail power
                hack surfline turds in the lineup. Backdoor lined up beat it
                kook cutback amped digs rail. Making the bottom turn tail click
                cutback precise wave Jamie OBrien late frothy top drainer twin
                keel.
            </p>
        </FormField>
    ))
    .add("content in a fieldset", () => (
        <Fieldset>
            <h3>This is heading 3 in a formfield</h3>
            <p>
                Vertical backside hack slash stuffs the rail goes vertical
                shaka, air section coffee poor monsters. Bottomed out rip, sand
                bottom over the reef rookie pigdog pose on the nose, closeout
                carves tomb-stoning. Wall clean best section set wave sandbar
                digs rail Jeffreys Bay. Ridin the foam ball rank set wave wrap,
                ice cream headaches. Sick Owen Wright rookie, wonky rail power
                hack surfline turds in the lineup. Backdoor lined up beat it
                kook cutback amped digs rail. Making the bottom turn tail click
                cutback precise wave Jamie OBrien late frothy top drainer twin
                keel.
            </p>
        </Fieldset>
    ));
storiesOf("1 Atoms/Typography/labels", module)
    .add("label in a formfield", () => (
        <FormField>
            <Label>Label in a formfield</Label>
            <p>
                Vertical backside hack slash stuffs the rail goes vertical
                shaka, air section coffee poor monsters. Bottomed out rip, sand
                bottom over the reef rookie pigdog pose on the nose, closeout
                carves tomb-stoning. Wall clean best section set wave sandbar
                digs rail Jeffreys Bay. Ridin the foam ball rank set wave wrap,
                ice cream headaches. Sick Owen Wright rookie, wonky rail power
                hack surfline turds in the lineup. Backdoor lined up beat it
                kook cutback amped digs rail. Making the bottom turn tail click
                cutback precise wave Jamie OBrien late frothy top drainer twin
                keel.
            </p>
        </FormField>
    ))
    .add("label in a fieldset", () => (
        <Fieldset legend="Legend in a fieldset">
            <p>
                Vertical backside hack slash stuffs the rail goes vertical
                shaka, air section coffee poor monsters. Bottomed out rip, sand
                bottom over the reef rookie pigdog pose on the nose, closeout
                carves tomb-stoning. Wall clean best section set wave sandbar
                digs rail Jeffreys Bay. Ridin the foam ball rank set wave wrap,
                ice cream headaches. Sick Owen Wright rookie, wonky rail power
                hack surfline turds in the lineup. Backdoor lined up beat it
                kook cutback amped digs rail. Making the bottom turn tail click
                cutback precise wave Jamie OBrien late frothy top drainer twin
                keel.
            </p>
        </Fieldset>
    ));
