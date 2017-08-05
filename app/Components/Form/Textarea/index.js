import React from 'react';

class Component extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div>
                <textarea
                    type="text"
                    ref="textArea"
                    className={`textarea ${this.props.className || ''}`}
                    data-size={this.props.size}
                    data-resize={this.props.resize}
                    data-no-border={this.props.noBorder}
                    data-bkg-active={this.props.bkgActive}
                    data-no-padding={this.props.noPadding}
                    maxLength={this.props.maxLength}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    defaultValue={this.props.value}
                    onChange={this.props.handleOnChange}
                    onBlur={this.props.handleOnBlur}
                    onKeyPress={this.props.handleOnKeyPress}
                />
            </div>
        );
    }
}

Component.propTypes = {
    name: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    maxLength: React.PropTypes.number,
    className: React.PropTypes.string,
    size: React.PropTypes.string,
    resize: React.PropTypes.string,
    noBorder: React.PropTypes.bool,
    noPadding: React.PropTypes.bool,
    bkgActive: React.PropTypes.bool,
    handleOnChange: React.PropTypes.func,
    handleOnBlur: React.PropTypes.func
};

export default Component;
