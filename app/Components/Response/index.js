import React from 'react';
import Icon from '../Icon';

class Response extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className={`Response ${this.props.className}`} data-size={this.props.size} data-message={this.props.messageModifier} data-no-top-space={this.props.noTopSpace}>
                {
                    this.props.icon ? (
                        <div className="Response__status">
                            {this.props.icon}
                        </div>
                    ) : (
                        <div className="Response__status">
                            {
                                this.props.failed ? (
                                    <Icon name="close" iconClass="icon--circle icon--white icon--red" padding="30px 0 40px 0" width="53.5px" height="40px"/>
                                ) : (
                                    <Icon name="check" iconClass="icon--circle icon--white icon--bkg-green" padding="37px 31px 35px 30px" width="53.5px" height="40px"/>
                                )
                            }
                        </div>
                    )
                }
                <h3 className="title--tertiary Response__title">{this.props.title}</h3>
                <p className="text--quaternary Response__message">{this.props.message}</p>
                {
                    this.props.link ? (
                        <p className="text--quaternary Response__link"><a href={this.props.linkAddress} target="_blank">{this.props.link}</a></p>
                    ) : ''
                }
                    <div className="Response__actions">
                        {this.props.children}
                    </div>
            </div>
        );
    }
}

Response.PropTypes = {
    className: React.PropTypes.string,
    size: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    failed: React.PropTypes.bool,
    icon: React.PropTypes.object,
    message: React.PropTypes.string,
    messageModifier: React.PropTypes.string,
    children: React.PropTypes.element,
    link: React.PropTypes.string,
    linkAddress: React.PropTypes.string,
    noTopSpace: React.PropTypes.bool
};

export default Response;
