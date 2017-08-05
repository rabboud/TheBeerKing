import React from 'react';
import Avatar from '../Avatar';
import Icon from '../Icon';

const WidgetPreview = ({
        className,
        version,
        color,
        position,
        icon,
        contentOpened
    }) => {
    const style = {
        backgroundColor: color
    };
    const getIconConfig = (widgetIcon) => {
        switch (widgetIcon) {
            case 'balloon-2':
                return {
                    width: '35px',
                    height: '26px',
                    padding: '18px 15px',
                    iconColor: 'white'
                };
            case 'speech-bubble-3':
                return {
                    width: '33px',
                    height: '30px',
                    padding: '16px',
                    iconColor: 'white'
                };
            case 'live-chat-3':
                return {
                    width: '42px',
                    height: '27px',
                    padding: '17.5px 11.5px',
                    iconColor: ''
                };
            case 'speech-bubble-2':
                return {
                    width: '27px',
                    height: '25px',
                    padding: '18.5px 19px',
                    iconColor: 'white'
                };
            case 'speech-bubble':
                return {
                    width: '31px',
                    height: '28px',
                    padding: '17px',
                    iconColor: 'white'
                };
            default:
                return {
                    width: '35px',
                    height: '26px',
                    padding: '12px 15px',
                    iconColor: 'white'
                };
        }
    };
    const iconConfig = getIconConfig(icon);

    return (
        <div
            className={`WidgetPreview ${className}`}
            data-version={version}
            data-position={position}
            data-content-opened={contentOpened}
        >
            {
                !contentOpened && version === '1.5' ? (
                    <Icon
                        name={icon}
                        width={iconConfig.width}
                        height={iconConfig.height}
                        padding={iconConfig.padding}
                        iconColor={iconConfig.iconColor}
                        bkgColor={color}
                        bkgCircle={true}
                        inline={true}
                    />
                ) : null
            }
            <div className="WidgetPreview__header" style={style}>
                <span className="WidgetPreview__header__title" />
            </div>
            <div className="WidgetPreview__content">
                <div className="WidgetPreview__card WidgetPreview__card--left">
                    <div className="row collapse WidgetPreview__card__row">
                        <div className="large-2 columns">
                            <Avatar src="default" size="small" fixedWidth={true}/>
                        </div>
                        <div className="large-9 columns">
                            <span className="WidgetPreview__message" data-size="medium"/>
                        </div>
                    </div>
                    <div className="row collapse WidgetPreview__card__row WidgetPreview__card__row--small">
                        <div className="large-12 columns">
                            <span className="WidgetPreview__message" data-size="medium"/>
                        </div>
                    </div>
                    <div className="row collapse WidgetPreview__card__row WidgetPreview__card__row--small">
                        <div className="large-12 columns">
                            <span className="WidgetPreview__message" data-size="medium"/>
                        </div>
                    </div>
                </div>
                <div className="WidgetPreview__card">
                    <div className="row collapse WidgetPreview__card__row">
                        <div className="large-9 columns">
                            <span className="WidgetPreview__message" data-size="medium"/>
                        </div>
                        <div className="large-2 columns">
                            <Avatar src="default" size="small" fixedWidth={true}/>
                        </div>
                    </div>
                    <div className="row collapse WidgetPreview__card__row WidgetPreview__card__row--small">
                        <div className="large-12 columns">
                            <span className="WidgetPreview__message" data-size="medium"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

WidgetPreview.PropTypes = {
    className: React.PropTypes.string,
    version: React.PropTypes.string,
    color: React.PropTypes.string,
    position: React.PropTypes.string,
    contentOpened: React.PropTypes.bool
};

WidgetPreview.defaultProps = {
    version: '1.0',
    color: '#565151',
    position: 'RIGHT',
    contentOpened: false
};

export default WidgetPreview;
