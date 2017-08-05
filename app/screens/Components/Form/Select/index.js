import React from 'react';
import _ from 'lodash';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <select
                ref={(c) => this.select = c}
                className={`select ${this.props.className || ''}`}
                defaultValue={this.props.value || this.props.placeholder}
                onChange={this.props.onChange}
            >
                {
                    _.map(this.props.dataValues, (options, key) => (
                        <option value={options.id} key={key}>{options.label}</option>
                    ))
                }
            </select>
        );
    }
}

Component.propTypes = {
    className: React.PropTypes.string,
    value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    placeholder: React.PropTypes.string,
    dataValues: React.PropTypes.array,
    onChange: React.PropTypes.func
};

export default Component;
