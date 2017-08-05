import React from 'react';
import _ from 'lodash';

const Component = ({enable, items}) => (
    <ul className="table__row__actions">
        {_.map(items, (item, key) => (
            <li key={key} data-enabled={item.enabled} className="table__row__actions__item">
                {item.component}
            </li>
        ))}
    </ul>
);

Component.propTypes = {
    enabled: React.PropTypes.bool,
    items: React.PropTypes.array.isRequired
};

export default Component;
