import React from 'react';

const Notification = ({className, children, notificationIcon, show}) => {
    return (
        <div className={`Notification ${className}`} data-show={show}>
            <div className="Notification__icon">
                <span className="Notification__icon__content">
                    {notificationIcon}
                </span>
            </div>
            {children}
        </div>
    );
};

Notification.PropTypes = {
    className: React.PropTypes.string,
    notificationIcon: React.PropTypes.string,
    show: React.PropTypes.bool
};

export default Notification;
