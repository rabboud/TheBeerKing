import React from 'react';
import {Icon} from 'app/screens/Components';


const Avatar = ({className = '', src, status, group, pieGraph, graphPercentage, count, size, retry, name, fixedWidth, forcedCircle, noBorder, margin, onClick}) => {
    const getIconSize = () => {
        switch (size) {
            case 'big':
                return {width: '80px', height: '80px'};
            case 'medium':
                return {width: '40px', height: '40px'};
            case 'small':
                return {width: '30px', height: '30px'};
            default:
                return {width: '25px', height: '25px'};
        }
    };

    return (
        <div
            className={`Avatar ${className}`}
            data-group={group}
            data-size={size}
            data-fixed-width={fixedWidth}
            data-graph={pieGraph}
            data-force-circle={forcedCircle}
            data-clickable={onClick ? true : false}
            data-no-border={noBorder}
            onClick={(e) => {if (onClick) {onClick(e);}}}
        >
            {
                pieGraph ? (
                    <svg className="Avatar__graph" width="60px" height="60px" data-size={size}>
                        <circle
                            className="Avatar__graph__circle"
                            r="22"
                            cx="30px"
                            cy="30px"
                            style={{
                                strokeDasharray: `${Math.floor(2 * 3.14 * 22 * graphPercentage / 100)} ${Math.floor(2 * 3.14 * 22)}`
                            }}
                        />
                    </svg>
                ) : ''
            }
            {
                count ? (
                    <label className="Avatar__count">
                        {`+${count}`}
                    </label>
                ) : (
                    typeof src === 'string' && src !== 'default' && src !== '' ? (
                        <img src={src} />
                    ) : (
                        <Icon name="user-profile" width={getIconSize().width} height={getIconSize().height}/>
                    )
                )
            }
            {
                name ? (
                    <div className="Avatar__name">
                        {name}
                    </div>
                ) : ''
            }
            {
                status && !retry ? (
                    <i className="Avatar__status" data-status={status} />
                ) : ''
            }
            {
                typeof retry === 'function' ? (
                    <label className="Avatar__retry" onClick={retry}>
                        <Icon name="reload" width="20px" height="20px" iconClass="rythm--center" />
                    </label>
                ) : ''
            }
        </div>
    );
};

Avatar.PropTypes = {
    className: React.PropTypes.string,
    src: React.PropTypes.string,
    status: React.PropTypes.string,
    group: React.PropTypes.bool,
    pieGraph: React.PropTypes.bool,
    graphPercentage: React.PropTypes.number,
    count: React.PropTypes.number,
    size: React.PropTypes.string,
    name: React.PropTypes.string,
    namePosition: React.PropTypes.string,
    fixedWidth: React.PropTypes.bool,
    forcedCircle: React.PropTypes.bool,
    noBorder: React.PropTypes.bool,
    retry: React.PropTypes.func,
    onClick: React.PropTypes.func
};

export default Avatar;
