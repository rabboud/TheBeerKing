import React from 'react';
import _ from 'lodash';

class SimpleList extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        const style = {
            'maxHeight': this.props.maxHeight || ''
        };

        return (
            <div className={`SimpleList ${this.props.className}`}>
                <ul style={style}>
                {
                    _.map(this.props.container, (options, key) => (
                        <li value={options.id} style={this.props.paddingLeft ? {paddingLeft: this.props.paddingLeft} : {}} key={key} onClick={(e) => this.props.onClick(options.id, e)}>{options.content}</li>
                    ))
                }
                </ul>
            </div>
        );
    }
}

SimpleList.PropTypes = {
    className: React.PropTypes.string,
    maxHeight: React.PropTypes.string,
    paddingLeft: React.PropTypes.string,
    container: React.PropTypes.array,
    onClick: React.PropTypes.func
};

SimpleList.defaultProps = {
    className: '',
    onClick: () => {}
};

export default SimpleList;
