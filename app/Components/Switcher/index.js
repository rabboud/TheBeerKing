import React from 'react';
import Switch from 'react-toggle-switch';

const Switcher = ({className = '', register = '', onClick, on, enabled}) => (
    <div className={`Switcher__container ${className}`}>
        <Switch className={'Switcher Switcher--' + register} onClick={onClick} on={on} enabled={enabled}/>
    </div>
);

Switcher.propTypes = {
    className: React.PropTypes.string,
    register: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired,
    on: React.PropTypes.bool.isRequired,
    enabled: React.PropTypes.bool
};

export default Switcher;
