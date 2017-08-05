import React from 'react';
import _ from 'lodash';
import Icon from '../Icon';

const Component = ({id, actions}) => {
    return (<nav className="table__action">
        <ul className="table__action__list">
            {_.map(actions, (item, key) => {
                return (<li className={`table__action__list__item table__action__list__item--${item.state} table__action__list__item--${item.type}`} key={key}>
                    <button onClick={(e) => item.handler(e, id)}>
                        <Icon name={item.icon} />
                    </button>
                </li>);
            })}
        </ul>
    </nav>);
};

Component.propTypes = {
    id: React.PropTypes.number,
    actions: React.PropTypes.array
};

export default Component;
