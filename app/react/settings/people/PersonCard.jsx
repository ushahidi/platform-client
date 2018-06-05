import React from "react";

const PersonCard = data => {
    return (
        <li class="list-item success">
            <h3>{data.person.name}</h3>
            <p>{data.person.role}</p>
        </li>
    );
}
export default PersonCard;
