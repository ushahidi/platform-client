import React from "react";
import { storiesOf } from "@storybook/react";

import ListItem from "./listitem";
import Button from "../../atoms/button/button";

storiesOf("Listitems", module)
    .add("with heading and description", () => (
        <ListItem>
            <h3>Heading</h3>
            <p>A sentence or less</p>
        </ListItem>
    ))
    .add("Successful list-item", () => (
        <ListItem className="success">
            <h3>Heading</h3>
            <p>A success list-item</p>
        </ListItem>
    ))
    .add("Selected list-item", () => (
        <ListItem className="selected">
            <h3>Heading</h3>
            <p>A selected list-item</p>
        </ListItem>
    ))
    .add("List-item with a button", () => (
        <ListItem>
            <h3>Heading</h3>
            <p>This list-item has a button attached</p>
            <Button type="BUTTON">Add new person</Button>
        </ListItem>
    ));
