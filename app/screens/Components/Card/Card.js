import React from 'react';
import _ from 'lodash';

const Component = ({
        header,
        height,
        helpers,
        headerSize,
        headerColor,
        title,
        titleColor,
        titleSize,
        subtitle,
        scrollable,
        children,
        status,
        contentColor,
        contentPadded,
        fullHeight,
        tabTitle,
        tabList,
        tabIndex,
        onTabClick
    }) => {
    const style = {
        height: height ? height : ''
    };

    return (
        <div
            className={`card ${helpers}`}
            style={style}
            data-content-padded={contentPadded}
            data-title-size={titleSize}
            data-title-color={titleColor}
            data-header-size={headerSize}
            data-header-color={headerColor}
            data-content-color={contentColor}
            data-full-height={fullHeight}
        >
            <div className="card__container">
                {
                    header || (tabList && tabList.length) ? (
                        <div className="card__header">
                            {
                                tabList ? (
                                    <div className="card__header__tabs">
                                        <ul className="card__header__tabs__list">
                                            {_.map(tabList, (item, key) => (
                                                <li className="card__header__tabs__item" data-active={key === tabIndex} key={key} onClick={() => onTabClick(key)}>
                                                    <div className="card__header__tabs__item__container">
                                                        {
                                                            item.icon ? (
                                                                <div className="card__header__tabs__item__icon" data-no-margin={!item.title}>
                                                                    {item.icon}
                                                                </div>
                                                            ) : ''
                                                        }
                                                        <span className="card__header__tabs__item__title">
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {
                                            tabTitle ? (
                                                <h5 className="card__header__tabs__title">{tabTitle}</h5>
                                            ) : null
                                        }
                                    </div>
                                ) : (
                                    <ul className="card__header__list">
                                        {_.map(header, (item, key) => {
                                            if (item.component) {
                                                return (
                                                    <li key={key} className={`card__header__list__item card__header__list__item--${item.status}`}>
                                                        {item.component}
                                                    </li>
                                                );
                                            }
                                        })}
                                    </ul>
                                )
                            }
                        </div>
                    ) : ''
                }
                {
                    title && title !== '' ? (
                        <div className="card__title" data-status={status}>
                            {title}
                            {
                                subtitle ? (
                                    <h5 className="title title--card-subtitle">{subtitle}</h5>
                                ) : ''
                            }
                        </div>
                    ) : ''
                }
                <div className="card__content" data-scrollable={scrollable || false}>
                    {children}
                </div>
            </div>
        </div>
    );
};

Component.propTypes = {
    header: React.PropTypes.array,
    headerColor: React.PropTypes.string,
    headerSize: React.PropTypes.string,
    tabTitle: React.PropTypes.string,
    tabList: React.PropTypes.array,
    tabIndex: React.PropTypes.number,
    helpers: React.PropTypes.string,
    title: React.PropTypes.any,
    titleColor: React.PropTypes.string,
    titleSize: React.PropTypes.string,
    subtitle: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.string
    ]),
    actions: React.PropTypes.array,
    scrollable: React.PropTypes.bool,
    fullHeight: React.PropTypes.bool,
    status: React.PropTypes.string,
    contentColor: React.PropTypes.string,
    contentPadded: React.PropTypes.bool,
    onTabClick: React.PropTypes.func
};

export default Component;
