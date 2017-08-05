import React from 'react';

const InfoLabel = ({className, kind, content}) => (
    <div className={`InfoLabel ${className}`} data-kind={kind}>{content}</div>
);

InfoLabel.PropTypes = {
    className: React.PropTypes.string,
    kind: React.PropTypes.string,
    content: React.PropTypes.string
};

export default InfoLabel;
