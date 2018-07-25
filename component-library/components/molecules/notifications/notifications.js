import * as React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import notification from "./notifications.scss";
import Icon from "../../atoms/icon/icon";

const NotificationType = {
    NEUTRAL: "neutral",
    SUCCESS: "success",
    ERROR: "error"
};

const propTypes = {
    notificationType: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired
};

const Notification = props => {
    const { notificationType, className, children, ...customProps } = props;

    const classProps = classnames(
        notification.notification,
        notification[NotificationType[notificationType]],
        notification[className]
    );

    console.log(NotificationType);

    return (
        <div>
            <div className={classProps} {...customProps}>
                <div className="notification-message">
                    {
                        if (NotificationType === "NEUTRAL") {
                            return <Icon icon="WARNING" />
                        } else if (NotificationType === "SUCCESS") {
                            return <Icon icon="CHECK" />
                        } else (NotificationType === "ERROR") {
                            return <Icon icon="CIRCLE_X" />
                        }
                    }

                    <p>{children}</p>
                </div>

                <div className="button-group">
                    <button className="button-beta">Undo</button>
                    <button className="button">Got it</button>
                </div>
            </div>
        </div>
    );
};

Notification.propTypes = propTypes;

Notification.defaultProps = {
    notificationType: NotificationType.NOTIFICATION,
    className: ""
};

export default Notification;
