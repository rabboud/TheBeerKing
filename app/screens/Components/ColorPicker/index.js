import _ from 'lodash';
import React from 'react';
import Icon from '../Icon';

class ColorPicker extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`ColorPicker ${this.props.className}`}>
                <ul className="ColorPicker__list">
                    {
                        _.map(this.props.colors, (color, key) => (
                            <li key={key} className="ColorPicker__list__item" style={{backgroundColor: color}} onClick={() => this.props.onClick(key)}>
                                {
                                    color === this.props.selectedColor ? (
                                        <Icon name="check" iconColor="white" width="10px"/>
                                    ) : ''
                                }
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

ColorPicker.PropTypes = {
    className: React.PropTypes.string,
    selectedColor: React.PropTypes.string,
    colors: React.PropTypes.array,
    onClick: React.PropTypes.func
};

export default ColorPicker;
