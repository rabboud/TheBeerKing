import React from 'react';

const Shape = ({className, type, width, height, color, borderColor, contentColor, children}) => {
    const style = {
        width: width,
        height: height
    };

    return (
        <div
            className={`Shape ${className}`}
            style={style}
            data-type={type}
            data-color={color}
            data-border-color={borderColor}
        >
            <div
                className="Shape__content"
                data-content-color={contentColor}
            >
                {children}
            </div>
        </div>
    );
};

Shape.PropTypes = {
    className: React.PropTypes.string
};

export default Shape;
