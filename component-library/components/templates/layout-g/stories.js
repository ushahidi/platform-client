import React from "react";
import { storiesOf } from "@storybook/react";
import Listitem from "../../molecules/listitem/listitem";
import Formfield from "../../molecules/formfields/formfield";
import Button from "../../atoms/button/button";
import Label from "../../atoms/formelements/label/label";
import Dropdown from "../../atoms/formelements/dropdown/dropdown";
import Input from "../../atoms/formelements/input/input";
import Icon from "../../atoms/icon/icon";
import Breadcrumbs from "../../molecules/breadcrumbs/breadcrumbs";
import Buttongroup from "../../molecules/buttongroup/buttongroup";
import Navbar from "../../molecules/navbar/navbar";
import Search from "../../molecules/search/search";

storiesOf("4 Templates/Layout-g/Settings/People", module)
    .add("people, start", () => (
        <div>
            <Navbar />
            <main role="main">
                <div className="full-col">
                    <Breadcrumbs
                        navigation={[
                            { path: "/settings", name: "Settings" },
                            { path: "/settings/people", name: "People" }
                        ]}
                    />
                    <ul>
                        <Listitem>
                            <h3>Add People to Ushahidi</h3>
                            <p>
                                Add members of your team, beneficiaries, and
                                other members or your community to Ushahidi.
                            </p>
                            <Button>Add People</Button>
                        </Listitem>
                        <Listitem>
                            <Search>
                                <form>
                                    <Formfield>
                                        <div className="input-with-icon">
                                            {/* ICON! #magnifying-glass (in the searchbar) */}
                                            <Icon icon="MAGINFYING_GLASS" />
                                            <Input
                                                inputType="SEARCH"
                                                placeholder="Search"
                                            />
                                        </div>
                                    </Formfield>

                                    <Buttongroup>
                                        <Button buttonType="BETA">
                                            Filter
                                        </Button>
                                        <Button buttonType="BETA">Sort</Button>
                                    </Buttongroup>
                                </form>
                            </Search>
                        </Listitem>
                    </ul>
                    <ul>
                        <Listitem>
                            <ul>
                                <Listitem className="success">
                                    <h3>Laurence Ipsum</h3>
                                    <p>Role: Member</p>
                                </Listitem>
                                <Listitem>
                                    <h3>Laurence Ipsum</h3>
                                    <p>Role: Member</p>
                                </Listitem>
                                <Listitem>
                                    <h3>Laurence Ipsum</h3>
                                    <p>Role: Member</p>
                                </Listitem>
                                <Listitem>
                                    <h3>Laurence Ipsum</h3>
                                    <p>Role: Member</p>
                                </Listitem>
                            </ul>
                        </Listitem>
                    </ul>
                </div>
            </main>
        </div>
    ))
    .add("people, add", () => (
        <div>
            <Navbar />
            <main role="main">
                <div className="full-col">
                    <Breadcrumbs
                        navigation={[
                            { path: "/settings", name: "Settings" },
                            { path: "/settings/people", name: "People" },
                            {
                                path: "/settings/people/add",
                                name: "Add someone to Ushahidi"
                            }
                        ]}
                    />

                    <Listitem>
                        <h3>Add People to Ushahidi</h3>
                        <p>
                            Add members of your team, beneficiaries, and other
                            members or your community to Ushahidi.
                        </p>
                    </Listitem>

                    <Listitem>
                        <form>
                            <Formfield>
                                <Label>Name</Label>
                                <Input
                                    inputType="text"
                                    placeholder="What is this person's name?"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Email</Label>
                                <Input
                                    inputType="email"
                                    placeholder="person@email.com"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Country code (optional)</Label>
                                <Dropdown
                                    options={[
                                        {
                                            value: "",
                                            name: "Select your option",
                                            selected: "true",
                                            disabled: "true"
                                        },
                                        { value: "254", name: "Kenya, +254" },
                                        { value: "1", name: "US, +1" }
                                    ]}
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Phone number (optional)</Label>
                                <Input
                                    inputType="phone"
                                    placeholder="1234567890"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Twitter (optional)</Label>
                                <Input inputType="text" placeholder="@person" />
                            </Formfield>

                            <Formfield>
                                <Label>Facebook username (optional)</Label>
                                <Input
                                    inputType="text"
                                    placeholder="person123"
                                />
                            </Formfield>

                            <Buttongroup>
                                <Button buttonType="BETA">Cancel</Button>
                                <Button>Add Person</Button>
                            </Buttongroup>
                        </form>
                    </Listitem>
                </div>
            </main>
        </div>
    ))
    .add("people, edit", () => (
        <div>
            <Navbar />
            <main role="main">
                <div className="full-col">
                    <Breadcrumbs
                        navigation={[
                            { path: "/settings", name: "Settings" },
                            { path: "/settings/people", name: "People" },
                            {
                                path: "/settings/people/edit",
                                name: "Seth Hall"
                            }
                        ]}
                    />

                    <Listitem>
                        <form>
                            <Formfield>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    placeholder="What is this person's name?"
                                    value="Seth Hall"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="person@email.com"
                                    value="seth@ushahidi.com"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Country code (optional)</Label>
                                <Dropdown
                                    options={[
                                        {
                                            value: "",
                                            name: "Select your option",
                                            selected: "true",
                                            disabled: "true"
                                        },
                                        { value: "254", name: "Kenya, +254" },
                                        { value: "1", name: "US, +1" }
                                    ]}
                                    value="1"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Phone number (optional)</Label>
                                <Input
                                    type="phone"
                                    placeholder="1234567890"
                                    value="919-867-5309"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Twitter (optional)</Label>
                                <Input
                                    type="text"
                                    placeholder="@person"
                                    value="@sethburtonhall"
                                />
                            </Formfield>

                            <Formfield>
                                <Label>Facebook username (optional)</Label>
                                <Input
                                    type="text"
                                    placeholder="person123"
                                    value="sethburtonhall"
                                />
                            </Formfield>
                            <Buttongroup>
                                <Button buttonType="BETA" disabled>
                                    Cancel
                                </Button>
                                <Button disabled>Save</Button>
                            </Buttongroup>
                        </form>
                    </Listitem>

                    <Listitem>
                        <form>
                            <Formfield>
                                <Label>Password</Label>
                                <Input inputType="password" value="•••••••" />
                            </Formfield>

                            <Formfield>
                                <Label>Repeat Password</Label>
                                <Input type="password" value="•••••••" />
                            </Formfield>

                            <Buttongroup>
                                <Button buttonType="BETA" disabled>
                                    Cancel
                                </Button>
                                <Button disabled>Save</Button>
                            </Buttongroup>
                        </form>
                    </Listitem>

                    <Listitem>
                        <Button buttonType="DESTRUCTIVE">Delete person</Button>
                    </Listitem>
                </div>
            </main>
        </div>
    ));
