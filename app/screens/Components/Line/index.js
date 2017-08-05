import React from 'react';

const Line = ({className, color, hexColor, width, height, rounded, noLeftMargin}) => {
    const style = {
        width: width,
        borderWidth: height,
        borderColor: hexColor
    };

    return (
        <hr className={`Line ${className}`}
            data-color={color}
            data-no-left-margin={noLeftMargin}
            data-rounded={rounded}
            style={style}
        />
    );
};

Line.PropTypes = {
    className: React.PropTypes.string,
    color: React.PropTypes.string,
    hexColor: React.PropTypes.string,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    rounded: React.PropTypes.bool,
    noLeftMargin: React.PropTypes.bool
};

export default Line;
