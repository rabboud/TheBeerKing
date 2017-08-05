import React from 'react';

const Sugestion = ({className, title, isOpen, children, onRequestClose, direction}) => (
    <div className={`Sugestion ${className}`} data-show={isOpen} data-direction={direction}>
        {
            title ? (
                <p>{title}</p>
            ) : ''
        }
        {children}
        <div className="Sugestion__backdrop" onClick={onRequestClose}></div>
    </div>
);

Sugestion.PropTypes = {
    className: React.PropTypes.string,
    title: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func,
    direction: React.PropTypes.string
};

export default Sugestion;
