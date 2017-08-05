import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <input
                className={`input-checkbox ${this.props.className}`}
                id={this.props.id}
                type="checkbox"
                name={this.props.name}
                checked={this.props.checked}
                disabled={this.props.disabled}
                onChange={this.props.onChange}
                onClick={this.props.onClick}
            />
        );
    }
}

Component.propTypes = {
    className: React.PropTypes.string,
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onClick: React.PropTypes.func
};

Component.defaultProps = {
    onClick: () => {},
    onChange: () => {},
    checked: false,
    disabled: false
};

export default Component;
