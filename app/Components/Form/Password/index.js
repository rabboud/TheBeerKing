import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <input type="password" className={`input-text ${this.props.className || ''}`} name={this.props.name} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.handleOnChange} onBlur={this.props.handleOnBlur} onKeyPress={this.props.handleOnKeyPress} />
        );
    }
}

Component.propTypes = {
    name: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    handleOnChange: React.PropTypes.func,
    handleOnBlur: React.PropTypes.func,
    handleOnKeyPress: React.PropTypes.func,
    className: React.PropTypes.string
};

export default Component;
