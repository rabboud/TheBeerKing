import React from 'react';
import Icon from '../../Icon';

const Component = ({photoUrl, className}) => {
    let photo;

    switch (photoUrl) {
        case 'default':
            photo = <Icon name="user-profile" width="30px" height="30px"/>;
            break;
        case 'audio':
            photo = (
                <Icon
                    name="voice"
                    width="11px"
                    heigh="18px"
                    padding="4px 9.5px"
                    iconClass="icon--circle icon--blue-primary"
                />
            );
            break;
        default:
            photo = <img className="message_photo__img" src={photoUrl} />;
    }

    return (
        <div className={`message_photo ${className || ''}`}>
            {photo}
        </div>
    );
};

Component.propTypes = {
    photoUrl: React.PropTypes.string,
    className: React.PropTypes.string
};

export default Component;
