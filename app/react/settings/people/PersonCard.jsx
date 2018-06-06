import React from "react";

const PersonCard = data => (
    <li className="list-item">
        <h3>{data.person.realname}</h3>
        <p>{data.person.role}</p>
    </li>
);

export default PersonCard;
