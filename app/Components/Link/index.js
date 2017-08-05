import React from 'react';
import {Link as ReactLink} from 'react-router';

const Link = ({url, external, children}) => {
    const getLink = () => {
        if (external) {
            return (
                <a href={url} target="_black">{children}</a>
            );
        }
        return (
            <ReactLink to={url}>{children}</ReactLink>
        );
    };

    return getLink();
};

Link.PropTypes = {
    url: React.PropTypes.string,
    external: React.PropTypes.bool
};

export default Link;
