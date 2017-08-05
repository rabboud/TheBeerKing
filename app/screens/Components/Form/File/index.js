import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`input-file ${this.props.className || ''}`}>
                <input ref="file" type="file" id="file" name="file" rel="file" className={`input-file__input ${this.props.className || ''}`} value={this.props.value} onChange={() => this.props.onChange(this.refs.file)}/>
                <label className="input-file__label" htmlFor="file">{this.props.label}</label>
            </div>
        );
    }
}

Component.propTypes = {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    className: React.PropTypes.string
};

export default Component;
