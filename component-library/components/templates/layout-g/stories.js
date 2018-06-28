import React from "react";
import { storiesOf } from "@storybook/react";
import ListItem from "../../molecules/listitem/listitem";
import FormField from "../../molecules/formfields/formfield";
import Button from "../../atoms/button/button";
import Input from "../../atoms/formelements/input/input";
import Breadcrumbs from "../../molecules/breadcrumbs/breadcrumbs";

storiesOf("4 Templates/Layout-g/Settings/People", module).add(
    "people, start",
    () => (
        <main role="main">
            <div className="full-col">
                <Breadcrumbs
                    navigation={[
                        { path: "/settings", name: "Settings" },
                        { path: "/settings/people", name: "People" }
                    ]}
                />
                <ul>
                    <ListItem>
                        <h3>Add People to Ushahidi</h3>
                        <p>
                            Add members of your team, beneficiaries, and other
                            members or your community to Ushahidi.
                        </p>
                        <Button>Add People</Button>
                    </ListItem>
                    <ListItem>
                        <div className="search">
                            <form>
                                <FormField>
                                    <Input
                                        inputType="search"
                                        placeholder="Search"
                                    />
                                </FormField>

                                <div className="button-group">
                                    <Button buttonType="BETA">Filter</Button>
                                    <Button buttonType="BETA">Sort</Button>
                                </div>
                            </form>
                        </div>
                    </ListItem>
                </ul>
                <ul>
                    <ListItem>
                        <ul>
                            <ListItem className="success">
                                <h3>Laurence Ipsum</h3>
                                <p>Role: Member</p>
                            </ListItem>
                            <ListItem>
                                <h3>Laurence Ipsum</h3>
                                <p>Role: Member</p>
                            </ListItem>
                            <ListItem>
                                <h3>Laurence Ipsum</h3>
                                <p>Role: Member</p>
                            </ListItem>
                            <ListItem>
                                <h3>Laurence Ipsum</h3>
                                <p>Role: Member</p>
                            </ListItem>
                        </ul>
                    </ListItem>
                </ul>
            </div>
        </main>
    )
);
