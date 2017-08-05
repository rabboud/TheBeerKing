import React from 'react';
import Icon from '../Icon';

const FlipCard = ({
        className,
        title,
        value,
        content,
        backTitle, backValue,
        backContent,
        showBack,
        clickable,
        onFrontClick,
        onCloseClick
    }) => (
    <div className={`FlipCard ${className}`}>
        <div className="FlipCard__container" data-show-back={showBack}>
            <div className="FlipCard__front" data-clickable={clickable} onClick={onFrontClick}>
                <div className="FlipCard__title">
                    <span className="FlipCard__title__text">
                        {title}
                    </span>
                    <hr className="FlipCard__title__divider"/>
                </div>
                {
                    typeof value !== 'undefined' ? (
                        <h1 className="FlipCard__value">
                            {value}
                        </h1>
                    ) : null
                }
                <div className="FlipCard__content">
                    {content}
                </div>
            </div>
            <div className="FlipCard__back">
                <div className="FlipCard__title">
                    <span className="FlipCard__title__text">
                        {backTitle ? backTitle : title}
                    </span>
                    <Icon
                        iconClass="pull--right"
                        name="x-small"
                        width="12px"
                        inline={true}
                        clickable={true}
                        handleClick={onCloseClick}
                    />
                    <hr className="FlipCard__title__divider"/>
                </div>
                {
                    backValue ? (
                        <h1 className="FlipCard__value">
                            {backValue}
                        </h1>
                    ) : null
                }
                <div className="FlipCard__content">
                    {backContent}
                </div>
            </div>
        </div>
    </div>
);

FlipCard.propTypes = {
    className: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    clickable: React.PropTypes.bool,
    onFrontClick: React.PropTypes.func,
    onCloseClick: React.PropTypes.func
};

export default FlipCard;
