// can we refactor to have a generic list?

import React from "react";
import PersonCard from "./PersonCard";

const PeopleList = data => (
    <div className="list-item list">
        <ul>
            {data.people.map((person, index) => (
                <PersonCard key={index} person={person} />
            ))}
        </ul>
    </div>
);
export default PeopleList;
