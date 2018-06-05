// can we refactor to have a generic list?

import React from "react";
import PersonCard from "./PersonCard";

const PeopleList = data =>
    data.people.map(person => <PersonCard person={person} />);

export default PeopleList;
