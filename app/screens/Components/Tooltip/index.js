import React from 'react';

class Tooltip extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div
                className={`Tooltip ${this.props.className}`}
                data-position={this.props.position}
            >
                {
                    this.props.header ? (
                        <div className="Tooltip__header" data-no-bkg={this.props.noHeaderBkg}>
                            {this.props.header}
                        </div>
                    )
                    : ''
                }
                {
                    this.props.children ? (
                        <div className="Tooltip__body">
                            {this.props.children}
                        </div>
                    )
                    : ''
                }
            </div>
        );
    }
}

Tooltip.propTypes = {
    className: React.PropTypes.string,
    header: React.PropTypes.element.isRequired,
    position: React.PropTypes.string,
    noHeaderBkg: React.PropTypes.bool
};

Tooltip.defaultProps = {
    className: '',
    position: ''
};

export default Tooltip;
