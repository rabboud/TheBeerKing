import React from 'react';
import loaderWhite from 'app/assets/images/loader_white.gif';
import loaderBlack from 'app/assets/images/loader_black.gif';

const Loader = ({className = '', color, full, fullScreen, backdrop}) => {
    const _getColor = () => {
        switch (color) {
            case 'black':
                return loaderBlack;
            default:
                return loaderWhite;
        }
    };

    return (
        <div className={`Loader ${className}`} data-full={full} data-full-screen={fullScreen} data-backdrop={backdrop}>
            <img className="Loader__img" src={_getColor()}/>
        </div>
    );
};

Loader.PropTypes = {
    className: React.PropTypes.string,
    color: React.PropTypes.string,
    backdrop: React.PropTypes.bool,
    full: React.PropTypes.bool,
    fullScreen: React.PropTypes.bool
};

export default Loader;
