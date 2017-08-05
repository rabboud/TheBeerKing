import React from 'react';
import _ from 'lodash';

const Animated = ({children, className, hidden, fade, slide, transition, secondariesPanel, activePanelIndex}) => (
    <div className={`Animated ${className || ''}`} data-slide={slide} data-transition={transition}>
        {
            transition ? (
                <div className="Animated__container">
                    <div className="Animated__panel Animated__panel--primary">
                        {children}
                    </div>
                    {_.map(secondariesPanel, (item, key) => (
                        <div className="Animated__panel Animated__panel--secondary" data-visible={key === activePanelIndex} key={key}>
                            {item}
                        </div>
                    ))}
                </div>
            ) : (
                {children}
            )
        }
    </div>
);

Animated.PropTypes = {
    className: React.PropTypes.string,
    hidden: React.PropTypes.bool,
    fade: React.PropTypes.bool,
    transition: React.PropTypes.bool,
    secondariesPanel: React.PropTypes.array,
    activePanelIndex: React.PropTypes.int
};

export default Animated;
