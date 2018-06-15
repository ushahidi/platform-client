import React from "react";
import { Link, BrowserRouter } from "react-router-dom";

const PersonCard = data => (
    <BrowserRouter>
        <Link to={`/settings/usersEdit/${data.person.id}`}>
            <div className="listing-item">
                <div className="listing-item-primary">
                    <div className="listing-item-image">
                        <img
                            className="avatar"
                            alt={data.person.realname}
                            src={`https://www.gravatar.com/avatar/${
                                data.person.gravatar
                            }?d=retro`}
                        />
                    </div>
                    <h2 className="listing-item-title">
                        {data.person.realname}
                    </h2>
                    <p className="listing-item-secondary">
                        Role: {data.person.role}
                    </p>
                </div>
            </div>
        </Link>
    </BrowserRouter>
);

export default PersonCard;
