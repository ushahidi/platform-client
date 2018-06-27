// can we refactor to have a generic list?

import React from "react";
import PersonCard from "./PersonCard";
import ListItem from "../../../../component-library/components/molecules/listitem/listitem";

const PeopleList = data => (
    <ListItem>
        <ul>
            {data.people.map(person => (
                <PersonCard key={person.id} person={person} />
            ))}
        </ul>
    </ListItem>
);
export default PeopleList;
