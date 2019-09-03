import React from "react";
import { storiesOf } from "@storybook/react";

import Search from "./search";
import Formfield from "../formfields/formfield";
import Fieldset from "../formfields/fieldset";
import Button from "../../atoms/button/button";
import Checkbox from "../../atoms/formelements/checkbox/checkbox";
import Input from "../../atoms/formelements/input/input";
import Label from "../../atoms/formelements/label/label";
import Buttongroup from "../buttongroup/buttongroup";
import Listitem from "../listitem/listitem";

storiesOf("2 Molecules/Search", module)
    .add("Closed searchbox without results", () => (
        <Search>
            <form>
                <Formfield>
                    <Label className="hidden">Field label</Label>
                    <Input inputType="SEARCH" placeholder="Search" />
                </Formfield>

                <Buttongroup>
                    <Button buttonType="BETA">Sort</Button>
                    <Button buttonType="BETA">Filter</Button>
                </Buttongroup>
            </form>
        </Search>
    ))
    .add("Open searchbox without results", () => (
        <Search>
            <form>
                <Formfield>
                    <Label className="hidden">Field label</Label>
                    <Input inputType="SEARCH" placeholder="Search" />
                </Formfield>

                <Buttongroup>
                    <Button buttonType="BETA">Sort</Button>
                    <Button buttonType="BETA">Filter</Button>
                </Buttongroup>
            </form>
            <div className="search-card">
                <Fieldset>
                    <Checkbox id="option_1" inForm="true" checkType="CHECKBOX">
                        Newest on top
                    </Checkbox>
                    <Checkbox id="option_2" inForm="true" checkType="CHECKBOX">
                        Unlocked on top{" "}
                    </Checkbox>
                </Fieldset>
                <Buttongroup>
                    <Button buttonType="BETA">Cancel</Button>
                    <Button buttonType="BETA">Apply</Button>
                </Buttongroup>
            </div>
        </Search>
    ))
    .add("Closed searchbox with results", () => (
        <Search>
            <form>
                <Formfield>
                    <Label className="hidden">Field label</Label>
                    <Input inputType="SEARCH" placeholder="Search" />
                </Formfield>

                <Buttongroup>
                    <Button buttonType="BUTTON">
                        Sort - <span>1</span>
                    </Button>
                    <Button buttonType="BETA">Filter</Button>
                </Buttongroup>
            </form>
            <ul>
                <Listitem>
                    <h3>Sample</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                </Listitem>
                <Listitem>
                    <h3>Sample</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                </Listitem>
                <Listitem>
                    <h3>Sample</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                </Listitem>
                <Listitem>
                    <h3>Sample</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                </Listitem>
                <Listitem>
                    <h3>Sample</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                </Listitem>
                <Listitem>
                    <h3>Sample</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur et. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                </Listitem>
            </ul>
        </Search>
    ));
