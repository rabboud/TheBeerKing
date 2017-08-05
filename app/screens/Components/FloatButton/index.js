import React from 'react';
import Icon from '../Icon';

const FloatButton = ({color, icon, position, handleClick}) => (
    <div className="FloatButton" data-position={position ? position : 'bottom-right'}>
        <Icon
            name={icon ? icon : 'trash'}
            inline={true}
            iconClass="icon--circle"
            iconColor="white"
            bkgColor="gray-primary"
            padding="16px 17px"
            width="15.8px"
            height="18px"
            clickable={true}
            handleClick={handleClick}
        />
    </div>
);

FloatButton.PropTypes = {
    color: React.PropTypes.string,
    icon: React.PropTypes.string,
    position: React.PropTypes.string,
    handleClick: React.PropTypes.func
};

export default FloatButton;
