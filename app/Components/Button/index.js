import React from 'react';
import {Button as ValidateButton} from 'omz-react-validation/lib/build/validation.rc';

const Component = ({children, disabled, handleOnClick, size, color, full, link, inverse, className, validate, textColor, textSize, large}) => {
    if (validate) {
        return (
            <ValidateButton
                className={`btn ${className || ''}`}
                onClick={disabled ? () => {} : handleOnClick}
                data-disabled={disabled}
                data-size={size}
                data-full={full}
                data-color={color}
                data-link={link}
                data-inverse={inverse}
                data-text-size={textSize}
                data-large={large}
            >
                {children}
            </ValidateButton>
        );
    }

    return (
        <button
            className={`btn ${className || ''}`}
            onClick={disabled ? () => {} : handleOnClick}
            data-disabled={disabled}
            data-size={size}
            data-full={full}
            data-color={color}
            data-text-color={textColor}
            data-link={link}
            data-inverse={inverse}
            data-text-size={textSize}
            data-large={large}
            tabIndex="-1"
        >
            {children}
        </button>
    );
};

Component.propTypes = {
    disabled: React.PropTypes.bool,
    handleOnClick: React.PropTypes.func,
    size: React.PropTypes.string,
    color: React.PropTypes.string,
    textColor: React.PropTypes.string,
    full: React.PropTypes.bool,
    link: React.PropTypes.bool,
    inverse: React.PropTypes.bool,
    className: React.PropTypes.string,
    validate: React.PropTypes.bool
};

export default Component;
