import React from 'react';
import _ from 'lodash';
import MessageBubble from './MessageBubble';
import MessagePhoto from './MessagePhoto';
import {InputText} from '../Form';
import Button from '../Button';
import InfiniteList from '../InfiniteList';
import MessageListItem from '../MessageListItem';
import {Form} from 'omz-react-validation/lib/build/validation.rc';
import StateMessage from '../StateMessage';

class Message extends React.Component {
    constructor (props) {
        super(props);
    }

    _hasReduce (interaction) {
        const medias = ['offcontact', 'email', 'meli_qst'];

        if (!this.props.hasReducer) {
            return '';
        }

        if (medias.includes(interaction.type)) {
            return 'message__list--reduce-offcontact';
        }

        if (interaction.state === 'TALKING' || this.props.interaction.state === 'CONNECTING' || interaction.state === 'RECONNECTING') {
            if (interaction.type === 'audio' || interaction.type === 'phone') {
                return 'message__list--reduce-audio';
            }

            if (interaction.type === 'video') {
                return 'message__list--reduce-video';
            }
        }
    }

    _getMessage (message) {
        if (message.type === 'NOTE') {
            return (
                <MessageListItem message={message} title="agent" type="note" color="gray"/>
            );
        }

        if (message.direction === 'CLIENT') {
            return (
                <div className="message--CLIENT">
                    <MessagePhoto photoUrl={this.props.clientPhoto}/>
                    <MessageBubble message={message}/>
                </div>
            );
        }

        if (message.direction === 'AGENT') {
            return (
                <div className="message--AGENT">
                    <MessageBubble message={message}/>
                    <MessagePhoto photoUrl={message.agentPhoto ? message.agentPhoto : this.props.agentPhoto}/>
                </div>
            );
        }
    }

    _getStateMessage () {
        if (this.props.interaction.state === 'RECONNECTING') {
            return (
                <div className="message__notification">
                    <StateMessage
                        icon="reload"
                        inline={true}
                        iconColor="white"
                        size="small"
                        messageState="WAITING"
                        containerType="bubble"
                        context="O cliente está mudando de página"
                    />
                </div>
            );
        }

        if (this.props.interaction.state === 'ENDED' && this.props.interaction.endOrigin === 'CLIENT') {
            return (
                <div className="message__notification">
                    <StateMessage containerType="bubble" context="O cliente encerrou o atendimento"/>
                </div>
            );
        }

        if (this.props.interaction.messages.status === 'LOADING'
            || this.props.interaction.messages.status === 'ERROR'
            || this.props.interaction.messages.status === 'TIMEOUT') {
            return (
                <div className="message__notification">
                    <StateMessage
                        inline={true}
                        hasLoader={true}
                        loaderColor="black"
                        messageState={this.props.interaction.messages.status}
                        containerType="bubble"
                        context="Carregamento das mensagens"
                    />
                </div>
            );
        }
    }

    render () {
        const reduce = this._hasReduce(this.props.interaction);
        const audioMessage = {
            content: this.props.interaction.state === 'TALKING' || this.props.interaction.state === 'CONNECTING' || this.props.interaction.state === 'RECONNECTING' ? 'Chamada de voz em andamento' : 'Chamada de voz encerrada',
            time: this.props.interaction.startTime,
            direction: 'AUDIO'
        };
        const activeInteractionMessage = {
            direction: 'INFO',
            content: 'Cliente aceitou o convite'
        };

        return (
            <div className="message" ref="messageContainer" data-has-children={this.props.children ? true : false}>
                {
                    this.props.interaction.type === 'audio' && (this.props.interaction.state === 'TALKING' || this.props.interaction.state === 'RINGING' || this.props.interaction.state === 'CONNECTING' || this.props.interaction.state === 'RECONNECTING') ? (
                        <div className="message__audio">
                            <audio className="message__audio__remote" ref="remoteAudioStream"/>
                            <MessageBubble message={audioMessage}/>
                            <MessagePhoto photoUrl={'audio'} className="message_photo--AUDIO"/>
                        </div>
                    ) : ''
                }
                {
                    this.props.interaction.type === 'phone' && (this.props.interaction.state === 'TALKING' || this.props.interaction.state === 'RINGING' || this.props.interaction.state === 'CONNECTING' || this.props.interaction.state === 'RECONNECTING') ? (
                         <div className="message__audio">
                             <MessageBubble message={audioMessage}/>
                             <MessagePhoto photoUrl={'audio'} className="message_photo--AUDIO"/>
                         </div>
                    ) : ''
                }
                {
                    this.props.interaction.type === 'video' && (this.props.interaction.state === 'TALKING' || this.props.interaction.state === 'RINGING' || this.props.interaction.state === 'CONNECTING' || this.props.interaction.state === 'RECONNECTING') ? (
                        <div className="message__video">
                            <video className="message__video__remote" ref="remoteVideoStream"/>
                            <video className="message__video__local" ref="localVideoStream"/>
                        </div>
                    ) : ''
                }
                {this._getStateMessage()}
                <InfiniteList
                    className={`message__list ${reduce}`}
                    ref={(c) => this.infiniteList = c}
                    autoScrollDown={true}
                    startOnBottom={true}
                    handleTopList={this.props.handleTopList}
                >
                    {
                        this.props.interaction.activeInteraction ? (
                            <li className="message__list__item">
                                {this.props.interaction.loadingMessages}
                                <div className="message--INFO">
                                    <MessageBubble message={activeInteractionMessage}/>
                                </div>
                            </li>
                        ) : ''
                    }
                    {_.map(this.props.interaction.messages.data, (message, key) => (
                        <li key={key} className="message__list__item">
                            {this._getMessage(message)}
                        </li>
                    ))}
                    {
                        this.props.interaction.typing ? (
                            <li className="message__list__item">
                                <div className="message--CLIENT">
                                    <MessagePhoto photoUrl={this.props.clientPhoto}/>
                                    <MessageBubble/>
                                </div>
                            </li>
                        ) : ''
                    }
                    {
                        this.props.interaction.state === 'ENDED' ? (
                            <li className="message__list__item">
                                <div className="message__list__item--action">
                                    <div className="message__list__item--action__title">
                                        <p className="message__list__item--action__text">
                                            Deseja enviar uma cópia da conversa por e-mail?
                                        </p>
                                    </div>
                                    <div className="message__list__item--action__footer">
                                        <Form>
                                            <div className="row collapse">
                                                <div className="large-8 columns">
                                                    <InputText name="email" placeholder="Informe o e-mail" value="" ref={(c) => {this.email = c;}} className="input--rounded input--border-gray" animation="input-animated" hasLabel={true} autoComplete="off" validations={['required']}/>
                                                </div>
                                                <div className="offset-1 large-3 columns message__list__item--action__button">
                                                    <Button className="btn--large-120" size="big" color="green-secondary" handleOnClick={this.props.sendInteractionEmail} validate={true}>
                                                        Enviar
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </li>
                        ) : ''
                    }
                </InfiniteList>
                <div className="message__action">
                    {this.props.children}
                </div>
            </div>
        );
    }

}

Message.propTypes = {
    interaction: React.PropTypes.object,
    hasReducer: React.PropTypes.bool,
    agentPhoto: React.PropTypes.string,
    clientPhoto: React.PropTypes.string,
    loading: React.PropTypes.bool,
    sendInteractionEmail: React.PropTypes.func,
    handleTopList: React.PropTypes.func
};

export default Message;
