import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <input
                className={`input-radio ${this.props.className}`}
                id={this.props.id}
                type="radio"
                name={this.props.name}
                checked={this.props.checked}
                onChange={this.props.onChange}
            />
        );
    }
}

Component.propTypes = {
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    checked: React.PropTypes.bool,
    onChange: React.PropTypes.func
};

export default Component;
