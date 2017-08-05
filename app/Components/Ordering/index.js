import React from 'react';
import Icon from '../Icon';

const Ordering = ({className, direction, handleClick}) => (
    <div className={`Ordering ${className}`} data-direction={direction} onClick={handleClick}>
        <div>
            <Icon iconClass="Ordering__icon Ordering__icon__up" name="chevron" width="8px" height="4px"/>
        </div>
        <div>
            <Icon iconClass="Ordering__icon Ordering__icon__down" name="chevron" width="8px" height="4px" rotate="180"/>
        </div>
    </div>
);

Ordering.PropTypes = {
    className: React.PropTypes.string,
    direction: React.PropTypes.direction
};

export default Ordering;
