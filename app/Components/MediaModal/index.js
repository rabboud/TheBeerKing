import React from 'react';
import Modal from 'react-modal';
import Media from '../Media';
import Icon from '../Icon';

class MediaModal extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Modal
                isOpen={this.props.open}
                shouldCloseOnOverlayClick={true}
                overlayClassName="MediaModal"
                className="MediaModal__content"
                contentLabel="MediaModal"
                onRequestClose={this.props.handleClose}
            >
                <div className="MediaModal__content__close">
                    <Icon name="close" width="30px" clickable={true} handleClick={this.props.handleClose}/>
                </div>
                <div className="MediaModal__content__media">
                    <Media type="youtube" src="https://www.youtube.com/embed/uyZW4re5wFY"/>
                </div>
            </Modal>
        );
    }
}

MediaModal.PropTypes = {
    className: React.PropTypes.string,
    open: React.PropTypes.bool,
    handleClose: React.PropTypes.func
};

export default MediaModal;
