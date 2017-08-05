import React from 'react';

const Media = ({className, type, src}) => (
    <div className={`Media ${className}`}>
        {
            type === 'youtube' ? (
                <iframe width="800" height="500" src={src} frameBorder="0" allowFullScreen={true}></iframe>
            ) : ''
        }
    </div>
);

Media.PropTypes = {
    className: React.PropTypes.string,
    type: React.PropTypes.string,
    src: React.PropTypes.string
};

export default Media;
