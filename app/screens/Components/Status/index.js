import React from 'react';

const Status = ({className, color}) => (
    <i className={`Status ${className}`} data-color={color}/>
);

Status.PropTypes = {
    className: React.PropTypes.string,
    color: React.PropTypes.string
};

export default Status;
