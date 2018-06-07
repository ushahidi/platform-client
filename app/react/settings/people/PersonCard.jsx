import React from "react";
import Link from "react/react-transition/Link";

const PersonCard = data => (
    <Link to={`settings/usersEdit/${data.person.id}`}>
        <li className="list-item">
            <h3>{data.person.realname}</h3>
            <p>{data.person.role}</p>
        </li>
    </Link>
);

export default PersonCard;
