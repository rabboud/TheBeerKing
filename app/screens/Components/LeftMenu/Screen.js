import React from 'react';
import {browserHistory} from 'react-router';
import _ from 'lodash';
import {Link} from 'react-router';
import {SettingsMenu} from 'app/screens/Components';
import {Icon} from 'app/screens/Components';
import logoIcon from 'file?name=[name].[ext]!app/assets/images/icons/logo.png';
import {OmzHistory} from 'app/services';
import {ValidatorHelper} from 'app/helpers';

class Component extends React.Component {
    constructor (props) {
        super(props);
        this.notificatedInteractions = {};
    }

    componentDidUpdate () {
        if (_.isEmpty(this.props.interactionStore.interactions) && !this.refs.ringingAudio.paused) {
            this._stopRingingAudio();
        }
    }

    componentWillUpdate () {
        _.forEach(this.notificatedInteractions, (value, key) => {
            if (_.keys(this.props.interactionStore.interactions).indexOf(key) < 0) {
                Reflect.deleteProperty(this.notificatedInteractions, key);
            }
        });
    }

    _handleLinkClick (sessionId) {
        if (this.notificatedInteractions[sessionId]) {
            if (this.notificatedInteractions[sessionId].newInteractionNotification) {
                this.notificatedInteractions[sessionId].newInteractionNotification.close();
            }
        }
    }

    _checkNotification () {
        const notificationSetting = localStorage.getItem('notification') === 'on';

        if (Notification) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        }

        return Notification.permission === 'granted' && notificationSetting && !document.hasFocus() ? true : false;
    }

    _sendDesktopNotification (title, body, sessionId, autoClose) {
        const notification = new Notification(title, {
            icon: '/assets/images/icons/' + logoIcon,
            body: body
        });

        notification.onclick = () => {
            notification.close();
            window.focus();
            browserHistory.push('/interaction?id=' + sessionId);
        };

        if (autoClose) {
            setTimeout(() => {
                notification.close();
            }, 5000);
        }

        return notification;
    }

    _notifyNewInteraction (sessionId) {
        const getType = (type) => {
            switch (type) {
                case 'text':
                    return 'chat';
                default:
                    return type;
            }
        };

        if (!Object.keys(this.notificatedInteractions).includes(sessionId)) {
            this._playRingingAudio();
            this.notificatedInteractions[sessionId] = {};

            if (this._checkNotification()) {
                const type = this.props.interactionStore.interactions[sessionId].type;
                const clientName = this.props.interactionStore.interactions[sessionId].customerInfo.name;
                const client = clientName ? ` de ${clientName}` : '';
                const notification = this._sendDesktopNotification(`Nova interação de ${getType(type)}${client}`, 'Clique aqui para atender!', sessionId, false);

                this.notificatedInteractions[sessionId].newInteractionNotification = notification;
            }
        }
    }

    _getMessageNotification (clientName, message) {
        if (ValidatorHelper.isImageUrl(message)) {
            return {
                title: `${clientName || 'Cliente'} te enviou uma imagem`,
                message: ''
            };
        }

        if (ValidatorHelper.isVideoUrl(message)) {
            return {
                title: `${clientName || 'Cliente'} te enviou um video`,
                message: ''
            };
        }

        if (ValidatorHelper.isAudioUrl(message)) {
            return {
                title: `${clientName || 'Cliente'} te enviou um audio`,
                message: ''
            };
        }

        const title = clientName ? `Mensagem não lida de ${clientName}` : 'Mensagem não lida';

        return {
            title: title,
            message: message
        };
    }

    _notifyNewMessage (interaction, sessionId) {
        if (!Object.keys(this.notificatedInteractions).includes(sessionId) || interaction.state !== 'TALKING') {
            return;
        }

        const totalClientMessages = _.filter(interaction.messages.data, {'direction': 'CLIENT'});

        if (totalClientMessages.length > 0 && this.notificatedInteractions[sessionId].messageCount !== totalClientMessages.length) {
            const clientName = interaction.customerInfo.name;
            const message = totalClientMessages[totalClientMessages.length - 1].content;
            const notificationData = this._getMessageNotification(clientName, message);

            if (this._checkNotification()) {
                this._sendDesktopNotification(notificationData.title, notificationData.message, sessionId, true);
            }

            this.refs.notificationAudio.play();
            this.notificatedInteractions[sessionId].messageCount = totalClientMessages.length;
        }
    }

    _notifyEndInteraction (interaction, sessionId) {
        if (this._checkNotification()) {
            if (this.props.interactionStore.interactions[sessionId] && this.notificatedInteractions[sessionId]) {
                const clientName = interaction.customerInfo.name ? interaction.customerInfo.name : interaction.clientForm.data.name;
                const title = `${clientName || 'Cliente'} encerrou a interação`;
                const message = 'Clique aqui para encerrar também';

                this._sendDesktopNotification(title, message, sessionId, true);
                Reflect.deleteProperty(this.notificatedInteractions, sessionId);
            }
        }
    }

    _notifyNewInbox () {
        return (this.props.interactionStore.alertInbox) ? 'red' : 'gray';
    }

    _stopRingingAudio () {
        for (const interaction in this.props.interactionStore.interactions) {
            if (this.props.interactionStore.interactions[interaction].state === 'RINGING') {
                return;
            }
        }

        this.refs.ringingAudio.pause();
        this.refs.ringingAudio.currentTime = 0;
    }

    _playRingingAudio () {
        if (this.refs.ringingAudio.paused) {
            this.refs.ringingAudio.play();
        }
    }

    _totalUnreadedMessages (interaction, key) {
        const unreadedMessages = _.filter(interaction.messages, {'state': 'NOTREADED', 'direction': 'CLIENT'});

        return key !== this.props.interactionStore.currentSessionId ? unreadedMessages.length : '';
    }

    _getAlert (interaction, key) {
        switch (interaction.state) {
            case 'RINGING':
                this._notifyNewInteraction(key);
                return {content: '!', color: ''};
            case 'RECONNECTING':
                return {content: (<Icon name="reload" width="10px" inline={true}/>), color: 'yellow'};
            case 'ENDED':
                this._notifyEndInteraction(interaction, key);
                this._stopRingingAudio();
                return {content: (<Icon name="x-small" width="8px" inline={true}/>), color: ''};
            default:
                this._stopRingingAudio();
                this._notifyNewMessage(interaction, key);
                return {content: this._totalUnreadedMessages(interaction, key), color: ''};
        }
    }

    _getInteractionTypeIcon (interaction, key) {
        const disabled = key !== this.props.interactionStore.currentSessionId ? 'icon--disabled' : '';
        const alert = this._getAlert(interaction, key);

        switch (interaction.type) {
            case 'text':
                return <Icon name="balloon" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="27px" height="21px"/>;
            case 'video':
                return <Icon name="video" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="27px" height="15.6px"/>;
            case 'audio':
                return <Icon name="voice" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="16px" height="27px"/>;
            case 'facebook':
                return <Icon name="messenger" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="24px" height="24px"/>;
            case 'telegram':
                return <Icon name="telegram" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="24px" height="24px"/>;
            case 'email':
            case 'offcontact':
                return <Icon name="mail" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="25px" height="16px"/>;
            case 'meli_qst':
            case 'meli_msg':
                return <Icon name="meli" iconClass={`icon--clickable ${disabled}--meli`} alert={alert.content} alertColor={alert.color} width="32px" height="23px"/>;
            case 'phone':
                return <Icon name="phone" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="25px" height="16px"/>;
            default:
                return <Icon name="balloon" iconClass={`icon--clickable ${disabled}`} alert={alert.content} alertColor={alert.color} width="27px" height="21px"/>;
        }
    }

    _isItemActive (item) {
        return OmzHistory.getLocation() === `/${item}`;
    }

    _handleNaviconClick () {
        this.props.viewsActions.toggleSettingsMenuState();
    }

    _getParent () {
        return document.querySelector('.main-wrapper');
    }

    render () {
        const interactions = this.props.interactionStore.interactions;
        const menuItems = (this.props.viewsStore.accountFree ? (
            [{location: 'inbox', icon: (<Link to="/inbox"><Icon name="inbox" width="25px" height="17px" alertColor={this._notifyNewInbox()} alert={this.props.viewsStore.inboxCount}/></Link>)}]
        ) : (
            [
                {location: '', icon: (<Link to="/"><Icon name="viewers" width="23px" height="30px" alertColor="green" alert={this.props.visitorTrackerStore.visitors.length}/></Link>)},
                {location: 'inbox', icon: (<Link to="/inbox"><Icon name="inbox" width="25px" height="17px" alertColor={this._notifyNewInbox()} alert={this.props.viewsStore.inboxCount}/></Link>)}
            ]
        ));

        return (
            <div>
                <nav className={`left-menu`}>
                    <ul className="left-menu__list">
                        <li className="left-menu__list__item left-menu__list__item--main" onClick={this._handleNaviconClick.bind(this)} data-active={this.props.viewsStore.settingsMenuState === 'opened'}>
                            <Icon name="navicon" width="22.3px" height="16px"/>
                        </li>
                        {_.map(menuItems, (item, key) => (
                            <li key={key} className="left-menu__list__item" data-active={this._isItemActive(item.location)}>
                                {item.icon}
                            </li>
                            )
                        )}
                        {_.map(interactions, (interaction, key) => (
                            <Link to={`/interaction?id=${key}`} key={key} onClick={() => this._handleLinkClick(key)}>
                                <li key={key} className="left-menu__list__item">
                                    {this._getInteractionTypeIcon(interaction, key)}
                                </li>
                            </Link>
                            )
                        )}
                    </ul>
                </nav>
                <audio src="https://s3-us-west-1.amazonaws.com/omnize-customer-audios/Omnize/OpeningAudio.mp3" loop="true" ref="ringingAudio"/>
                <audio src="https://s3-us-west-1.amazonaws.com/omnize-customer-audios/Omnize/Notification.mp3" ref="notificationAudio"/>
                <SettingsMenu
                    closed={this.props.viewsStore.settingsMenuState === 'closed'}
                    user={this.props.currentUserStore}
                    handleOnClose={this._handleNaviconClick.bind(this)}
                    parentSelector={this._getParent.bind(this)}
                />
            </div>
        );
    }
}

Component.propTypes = {
    state: React.PropTypes.string,
    items: React.PropTypes.array,
    settingsMenuState: React.PropTypes.string,
    handleNaviconClick: React.PropTypes.func
};

export default Component;
