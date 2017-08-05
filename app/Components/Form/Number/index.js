import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    handleOnChange (event, element) {
        event.target.value = parseInt(event.target.value, 10) || '';
    }

    render () {
        return (
            <input className="input-number" type="number" name={this.props.name} placeholder={this.props.placeholder} value={this.props.value} onChange={(event) => this.handleOnChange(event, this)} onBlur={this.props.handleOnBlur} onKeyPress={this.props.handleOnKeyPress} />
        );
    }
}

Component.propTypes = {
    name: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    handleOnChange: React.PropTypes.func,
    handleOnBlur: React.PropTypes.func,
    handleOnKeyPress: React.PropTypes.func
};

export default Component;
