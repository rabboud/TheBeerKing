import React from 'react';
import {ChromePicker as ReactChromePicker} from 'react-color';
import onClickOutside from 'react-onclickoutside';

class ChromePicker extends React.Component {
    constructor (props) {
        super(props);
    }

    handleClickOutside (e) {
        this.props.onClose(e);
    }

    render () {
        return (
            <div className={`ChromePicker ${this.props.className}`}>
                <ReactChromePicker
                    color={this.props.color}
                    disableAlpha={true}
                    onChangeComplete={this.props.onChange}
                />
            </div>
        );
    }
}

ChromePicker.propTypes = {
    className: React.PropTypes.string,
    color: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
};

ChromePicker.defaultProps = {
    className: ''
};

export default onClickOutside(ChromePicker);
