import React from "react";
import { Link } from "react-router-dom";
import ListItem from "../../../../component-library/components/molecules/listitem/listitem";

const PersonCard = data => (
    <Link to={`/settings/usersEdit/${data.person.id}`}>
        <ListItem className="success">
            <h3>{data.person.realname}</h3>
            <p>Role: {data.person.role}</p>
        </ListItem>
    </Link>
);

export default PersonCard;
