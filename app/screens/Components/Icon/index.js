import React from 'react';
import InlineSVG from 'svg-inline-react';

const Component = (props) => {
    const svgFile = require(`app/assets/images/icons/${props.name}.svg`);

    const svgStyle = {
        width: props.width,
        height: props.height
    };

    const containerStyle = {
        padding: props.padding,
        backgroundColor: props.bkgColor
    };

    const click = (e) => {
        if (props.handleClick) {
            props.handleClick(props.name, e);
        }
    };

    const animation = () => {
        switch (props.alert) {
            case '!':
                return 'icon__alert--jump--infinite';
            default:
                return 'icon__alert--jump';
        }
    };

    return (
        <div
            className={`icon ${props.iconClass}`}
            data-icon-color={props.iconColor}
            data-rotate={props.rotate}
            data-bkg={props.bkg}
            data-bkg-size={props.bkgSize}
            data-bkg-circle={props.bkgCircle}
            data-bkg-rounded={props.bkgRounded}
            data-bkg-color={props.bkgColor}
            data-bkg-border={props.bkgBorder}
            data-inline={props.inline}
            data-opacity={props.opacity}
            data-clickable={props.clickable}
            data-hover={props.hover}
            data-stroke-color={props.strokeColor}
            style={containerStyle}
            onClick={click}
            onMouseDown={props.onMouseDown}
        >
            <div
                className={`icon__alert  ${animation()} ${props.alert > 99 ? 'icon__alert--medium' : ''}`}
                data-show={props.alert ? 'true' : 'false'}
                data-size={props.alertSize}
                data-color={props.alertColor}
            >
                <div className="icon__alert__container">
                    <div className="icon__alert__content">
                        {props.alert}
                    </div>
                </div>
            </div>
            <InlineSVG
                src={svgFile}
                element="div"
                style={svgStyle}
                className="icon__svg"
            />
            {props.iconText
                ? <p className={`icon-text ${props.textClass}`}>{props.iconText}</p>
                : ''
            }
        </div>
    );
};

Component.propTypes = {
    name: React.PropTypes.string.isRequired,
    iconClass: React.PropTypes.string,
    textClass: React.PropTypes.string,
    iconColor: React.PropTypes.string,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    rotate: React.PropTypes.string,
    padding: React.PropTypes.string,
    alert: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
        React.PropTypes.object
    ]),
    alertSize: React.PropTypes.string,
    alertColor: React.PropTypes.string,
    bkg: React.PropTypes.bool,
    bkgSize: React.PropTypes.string,
    bkgCircle: React.PropTypes.bool,
    bkgRounded: React.PropTypes.bool,
    bkgColor: React.PropTypes.string,
    bkgBorder: React.PropTypes.string,
    inline: React.PropTypes.bool,
    clickable: React.PropTypes.bool,
    opacity: React.PropTypes.string,
    hover: React.PropTypes.string,
    strokeColor: React.PropTypes.string,
    handleClick: React.PropTypes.func,
    onMouseDown: React.PropTypes.func
};

export default Component;
