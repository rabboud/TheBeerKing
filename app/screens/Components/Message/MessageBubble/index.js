import React from 'react';
import Moment from 'moment';
import Linkify from 'omz-react-linkify';
import Icon from '../../Icon';
import {ValidatorHelper} from 'app/helpers';

class MessageBubble extends React.Component {
    constructor (props) {
        super(props);
        this.isMedia = false;
    }

    componentDidMount () {
        if (this.messageBubble.offsetHeight > 30) {
            this.messageBubble.dataset.round = 'small';
            return;
        }
        this.messageBubble.dataset.round = 'big';
    }

    componentDidUpdate () {
        if (this.messageBubble.offsetHeight > 30) {
            this.messageBubble.dataset.round = 'small';
            return;
        }
        this.messageBubble.dataset.round = 'big';
    }

    _getStateElement (state) {
        switch (state) {
            case 'SENDED':
                return (
                    <div className="message_bubble__content__status">
                        <Icon name="check" iconClass="icon--inline icon--gray" width="10px" heigh="10px"/>
                    </div>
                );
            case 'DELIVERED':
                return (
                    <div className="message_bubble__content__status">
                        <Icon name="check" iconClass="icon--inline icon--push-right-5 icon--gray" width="10px" heigh="10px"/>
                        <Icon name="check" iconClass="icon--inline icon--gray" width="10px" heigh="10px"/>
                    </div>
                );
            case 'FAILED':
                return (
                    <div className="message_bubble__content__status message_bubble__content__status--ERROR">
                        <span className="message_bubble__content__status__message">!</span>
                    </div>
                );
            default:
                return '';
        }
    }

    _parseContent (content) {
        let result;
        const linkProp = {target: '_blank'};

        if (content.split(' ').length > 1) {
            return (
                <Linkify properties={linkProp}>
                    {content}
                </Linkify>
            );
        }

        if (ValidatorHelper.isImageUrl(content)) {
            this.modifier = 'message_bubble--media';
            return (
                <div className="media-container">
                    <a href={content} target="_blank">
                        <img src={content}/>
                    </a>
                </div>
            );
        }

        if (ValidatorHelper.isVideoUrl(content)) {
            this.modifier = 'message_bubble--media';
            return (
                <div className="media-container">
                    <video controls={true} src={content}/>
                </div>
            );
        }

        if (ValidatorHelper.isAudioUrl(content)) {
            this.modifier = 'message_bubble--media';
            return (
                <div className="media-container">
                    <audio controls={true} src={content}/>
                </div>
            );
        }

        return result ? result : (
            <Linkify properties={linkProp}>
                {content}
            </Linkify>
        );
    }

    render () {
        const direction = this.props.message ? this.props.message.direction : 'CLIENT';
        const time = this.props.message ? Moment(this.props.message.time) : Moment();
        const state = this.props.message ? this.props.message.state : 'AGENT';

        return (
            <div className={`message_bubble message_bubble--${direction} ${this.modifier || ''}`} data-round="big" ref={(c) => this.messageBubble = c}>
                <span className="message_bubble__content">
                    {
                        this.props.message ? (
                            this._parseContent(this.props.message.content)
                        ) : (
                            <div className="message_bubble__content__typing">
                                <div className="message_bubble__content__typing__container">
                                    <div/><div/><div/>
                                </div>
                           </div>
                        )
                    }
                    {
                        this.props.message && this.props.message.time ? (
                            <span className="message_bubble__time">
                                {time.format('HH:mm')}
                            </span>
                        ) : ''
                    }
                    {
                        direction === 'AGENT' ? (
                            this._getStateElement(state)
                        ) : ''
                    }
                </span>
            </div>
        );
    }
}

MessageBubble.propTypes = {
    message: React.PropTypes.object
};

export default MessageBubble;
