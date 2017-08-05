import React from 'react';
import Icon from '../Icon';

const Tag = ({className, color, children, removable, title, handleClick}) => (
    <div className="Tag" style={{backgroundColor: color}}>
      {title}
      {removable
        ? <div className="Tag__exclude">
            <Icon name="close" width="8px" height="8px" clickable={true} inline={true} handleClick={handleClick}/>
        </div>
        : null
      }
    </div>
);

Tag.PropTypes = {
    className: React.PropTypes.func,
    color: React.PropTypes.string,
    title: React.PropTypes.string,
    removable: React.PropTypes.bool,
    handleClick: React.PropTypes.func
};

export default Tag;
