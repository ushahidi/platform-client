import React from "react";
import { storiesOf } from "@storybook/react";
import ListItem from "../../molecules/listitem/listitem";
import Form from "./form";
import FormField from "../../molecules/formfields/formfield";
import Label from "../../atoms/label/label";
import Input from "../../atoms/input/input";
import Dropdown from "../../atoms/dropdown/dropdown";
import Button from "../../atoms/button/button";

storiesOf("Forms", module).add("with multiple fields", () => (
    <div>
        <ListItem>
            <h3>Add people to Ushahidi</h3>
            <p>
                Add members of your team, beneficiaries, and other members or
                your community to Ushahidi.
            </p>
        </ListItem>
        <ListItem>
            <Form>
                <FormField>
                    <Label className="form-field" htmlFor="name">
                        Name
                    </Label>
                    <Input
                        className="form-field"
                        id="name"
                        placeholder="What is this person's name?"
                    />
                </FormField>

                <FormField>
                    <Label className="form-field" htmlFor="email">
                        Email
                    </Label>
                    <Input
                        className="form-field"
                        inputType="EMAIL"
                        placeholder="person@email.com"
                        id="email"
                    />
                </FormField>

                <FormField>
                    <Label className="form-field" htmlFor="countrycode">
                        Country code (optional)
                    </Label>
                    <Dropdown
                        id="countrycode"
                        className="form-field"
                        options={[
                            {
                                value: "",
                                name: "Select your option",
                                disabled: true,
                                selected: true
                            },
                            { value: "254", name: "Kenya, +254" },
                            { value: "1", name: "US, +1" }
                        ]}
                    />
                </FormField>
                <FormField>
                    <Label className="form-field" htmlFor="phone">
                        Phone number (optional)
                    </Label>
                    <Input
                        className="form-field"
                        inputType="PHONE"
                        placeholder="1234567"
                        id="phone"
                    />
                </FormField>
                <FormField>
                    <Label className="form-field" htmlFor="twitter">
                        Twitter (optional)
                    </Label>
                    <Input
                        className="form-field"
                        id="twitter"
                        placeholder="@person"
                    />
                </FormField>
                <FormField>
                    <Label className="form-field" htmlFor="facebook">
                        Facebook (optional)
                    </Label>
                    <Input
                        className="form-field"
                        id="facebook"
                        placeholder="person123"
                    />
                </FormField>

                <Button type="button" buttonType="BETA">
                    Cancel
                </Button>
                <Button type="submit">Add person</Button>
            </Form>
        </ListItem>
    </div>
));
