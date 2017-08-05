import React from 'react';
import Modal from 'react-modal';

const OMZModal = ({className, isOpen, shouldCloseOnOverlayClick, onRequestClose, parentSelector, children}) => (
    <Modal
        isOpen={isOpen}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        overlayClassName={`OMZModal ${className}`}
        className="OMZModal__content"
        contentLabel="Modal"
        onRequestClose={onRequestClose}
        parentSelector={parentSelector}
    >
        {children}
    </Modal>
);

OMZModal.PropTypes = {
    className: React.PropTypes.string,
    isOpen: React.PropTypes.bool,
    shouldCloseOnOverlayClick: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func,
    parentSelector: React.PropTypes.func
};

export default OMZModal;
