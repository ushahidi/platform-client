import React from "react";
import Form from "../../../../component-library/components/organisms/form/form";
import FormField from "../../../../component-library/components/molecules/formfields/formfield";
import Input from "../../../../component-library/components/atoms/input/input";
import ListItem from "../../../../component-library/components/molecules/listitem/listitem";
import Button from "../../../../component-library/components/atoms/button/button";

const SettingsSearch = () => (
    <ListItem>
        <div className="search">
            <Form>
                <FormField>
                    <Input inputType="search" placeholder="Search" />
                </FormField>
                <div className="button-group">
                    <Button buttonType="BETA">Filter</Button>
                    <Button buttonType="BETA">Sort</Button>
                </div>
            </Form>
        </div>
    </ListItem>
);

export default SettingsSearch;
