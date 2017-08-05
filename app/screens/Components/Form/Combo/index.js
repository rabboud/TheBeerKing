import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="input-combo__container">
                {
                    this.props.label ? (
                        <label>{this.props.label}</label>
                    ) : ''
                }
                <select className={`input-combo ${this.props.className || ''}`} value={this.props.value} onChange={this.props.handleOnChange} onClick={this.props.handleOnClick} onFocus={this.props.handleOnFocus} ref="comboSelect">
                    {
                        this.props.options.map((option, key) => <option key={key} value={option.value}>{option.name}</option>)
                    }
                </select>
            </div>
        );
    }
}

Component.propTypes = {
    label: React.PropTypes.string,
    options: React.PropTypes.array,
    value: React.PropTypes.string,
    handleOnClick: React.PropTypes.func,
    handleOnChange: React.PropTypes.func,
    handleOnFocus: React.PropTypes.func,
    error: React.PropTypes.bool,
    className: React.PropTypes.string
};

export default Component;
