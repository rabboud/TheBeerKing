import React from 'react';
import Modal from 'react-modal';

class ModalDefault extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Modal
                isOpen={this.props.isOpen}
                overlayClassName={`ModalDefault ${this.props.cardContent ? 'ModalDefault--card-content' : '' } ${this.props.transparent ? 'ModalDefault--transparent' : '' } ${this.props.className}`}
                className={`ModalDefault__content ${this.props.className}__content ${this.props.hasShadow ? 'ModalDefault__content--shadow' : '' } ${this.props.isCentralized ? 'ModalDefault__content--centralized' : '' }`}
                contentLabel="Modal"
                onAfterOpen={this.props.onAfterOpen}
                onRequestClose={this.props.onRequestClose}
                shouldCloseOnOverlayClick={this.props.shouldCloseOnOverlayClick}
                parentSelector={this.props.parentSelector}
            >
                {this.props.children}
            </Modal>
        );
    }
}

ModalDefault.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
    shouldCloseOnOverlayClick: React.PropTypes.bool,
    cardContent: React.PropTypes.bool,
    hasShadow: React.PropTypes.bool,
    isCentralized: React.PropTypes.bool,
    transparent: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func,
    onAfterOpen: React.PropTypes.func,
    parentSelector: React.PropTypes.func
};

export default ModalDefault;
