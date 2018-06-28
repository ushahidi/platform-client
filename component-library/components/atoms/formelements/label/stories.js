/* @flow */

import React from "react";
import { storiesOf } from "@storybook/react";

import Label from "./label";

storiesOf("1 Atoms/Form Elements/Label", module)
    .add("label, default", () => (
        <Label htmlFor="g" labelType="DEFAULT">
            This is a default label
        </Label>
    ))
    .add("label, required", () => (
        <Label htmlFor="g" labelType="REQUIRED">
            This label indicates that something is required
        </Label>
    ))
    .add("label, error", () => (
        <Label htmlFor="g" labelType="ERROR">
            This label indicates that something is wrong
        </Label>
    ));
