import React from 'react';
import Icon from '../Icon';

const Text = ({className, content, type, textColor, textSize, textBold, iconName, iconWidth, iconHeight, iconColor, inline, wrap, fontSize, underline, selectable, onClick, rightPadding}) => {
    const fontStyle = {
        fontSize: fontSize,
        textDecoration: underline ? 'underline' : ''
    };

    return (
        <span className={`Text ${className}`} data-type={type} data-inline={inline} data-selectable={selectable} data-right-padding={rightPadding} data-wrap={wrap} onClick={() => {if (onClick) {onClick();}}}>
            {
                iconName ? (
                    <Icon iconClass="Text__icon" name={iconName} width={iconWidth || ''} height={iconHeight || ''} iconColor={iconColor || ''} inline={true}/>
                ) : ''
            }
            <span className="Text__content" style={fontStyle} data-text-color={textColor} data-text-size={textSize} data-text-bold={textBold}>
                {content}
            </span>
        </span>
    );
};

Text.PropTypes = {
    className: React.PropTypes.string,
    content: React.PropTypes.string.isRequired,
    type: React.PropTypes.string,
    textColor: React.PropTypes.string,
    textSize: React.PropTypes.string,
    textBold: React.PropTypes.string,
    iconName: React.PropTypes.string,
    iconWidth: React.PropTypes.string,
    iconHeight: React.PropTypes.string,
    iconColor: React.PropTypes.string,
    fontSize: React.PropTypes.string,
    underline: React.PropTypes.bool,
    inline: React.PropTypes.bool,
    wrap: React.PropTypes.bool,
    selectable: React.PropTypes.bool,
    rightPadding: React.PropTypes.string,
    onClick: React.PropTypes.func
};

export default Text;
