import React from 'react';
import Icon from '../Icon';
import Button from '../Button';
import FileReaderInput from 'react-file-reader-input';
import EmojiPicker from 'emojione-picker';

class MessageInput extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selected: false,
            showEmoji: false
        };
    }

    _handleKeyDown (event) {
        const value = this.refs.messageInputText.value;

        if (event.keyCode === 13) {
            event.preventDefault();
            if (value.length === 0) {
                return;
            }

            if (event.shiftKey) {
                this.refs.messageInputText.value = value + '\n';
                return;
            }
            this.props.onInsertMessage(value);
        }

        if (event.keyCode === 27) {
            this._closeEmojiPicker();
        }
    }

    _handleIconClick (iconName) {
        if (iconName === 'send') {
            if (this.refs.messageInputText.value !== '') {
                this.props.onInsertMessage(this.refs.messageInputText.value);
            }
        }

        if (iconName === 'trash') {
            this.props.onDeleteClick();
        }
    }

    _handleRespondClick (event) {
        event.preventDefault();

        this.refs.messageInputMain.dataset.email = true;
        this.props.handleRespondClick();
    }

    _handleInputMainClick (event) {
        // event.preventDefault();
        if (this.refs.messageInputText) {
            this.refs.messageInputText.focus();
        }

        if (this.refs.messageInputTextEmail) {
            this.refs.messageInputTextEmail.focus();
        }
    }

    _handleInputFocus () {
        this.setState({
            selected: true
        });
    }

    _handleInputBlur () {
        this.setState({
            selected: false
        });
    }

    _toggleEmojiPicker () {
        this.setState({
            showEmoji: !this.state.showEmoji
        });
    }

    _closeEmojiPicker () {
        this.setState({
            showEmoji: false
        });
    }

    _addEmoji (data) {
        this.props.onChangeMessage(data);
    }

    render () {
        const categories = {
            people: {
                title: 'Pessoas',
                emoji: 'smile'
            },
            nature: {
                title: 'Animais e Natureza',
                emoji: 'owl'
            },
            food: {
                title: 'Comidas e Bebidas',
                emoji: 'pizza'
            },
            activity: {
                title: 'Atividades',
                emoji: 'soccer'
            },
            travel: {
                title: 'Viagens e Locais',
                emoji: 'earth_americas'
            },
            objects: {
                title: 'Objetos',
                emoji: 'bulb'
            },
            symbols: {
                title: 'Símbolos',
                emoji: 'clock9'
            },
            flags: {
                title: 'Bandeiras',
                emoji: 'flag_br'
            }
        };

        return (
            <div className="message-input" ref="messageInputMain" data-email={this.props.isEmailInput} onClick={this._handleInputMainClick.bind(this)}>
                <div className="message-input__container" data-selected={this.state.selected}>
                    <div className="message-input__actions">
                        {
                            this.props.isEmailInput ? (
                                <div className="message-input__actions__item">
                                    {
                                        this.props.agentPhoto === 'default' ? (
                                            <Icon name="user-profile" width="20px" height="20px"/>
                                        ) : (
                                            <img className="message-input__img" src={this.props.agentPhoto}/>
                                        )
                                    }
                                </div>
                            ) : (
                                <div className="message-input__actions__item">
                                    <Icon
                                        name="smile"
                                        width="20px"
                                        iconClass="icon--clickable"
                                        handleClick={this._toggleEmojiPicker.bind(this)}
                                    />
                                    {
                                        this.state.showEmoji ? (
                                            <EmojiPicker className="message-input__actions__emoji-picker" categories={categories} onChange={(data) => this._addEmoji(data)}/>
                                        ) : ''
                                    }
                                </div>
                            )
                        }
                    </div>
                    <div className="message-input__input">
                        {
                            this.props.isEmailInput ? (
                                <div className="message-input__input__container">
                                    <p className="message-input__input__text">
                                        Clique aqui para <a href="#" onClick={this._handleRespondClick.bind(this)}>Responder</a>
                                    </p>
                                    <textarea
                                        value={this.props.currentMessage}
                                        ref="messageInputTextEmail"
                                        className="message-input__input__email no-resize"
                                        placeholder="Escrever mensagem"
                                        onFocus={this._handleInputFocus.bind(this)}
                                        onBlur={this._handleInputBlur.bind(this)}
                                        onChange={this.props.onChangeMessage}
                                    />
                                </div>
                            ) : (
                                <textarea
                                    value={this.props.currentMessage}
                                    ref="messageInputText"
                                    className="message-input__input__textarea no-resize"
                                    onChange={this.props.onChangeMessage}
                                    onKeyDown={this._handleKeyDown.bind(this)}
                                    onFocus={this._handleInputFocus.bind(this)}
                                    onBlur={this._handleInputBlur.bind(this)}
                                />
                            )
                        }
                    </div>
                    {
                        this.props.isEmailInput
                            ? null : (
                                <div className="message-input__actions">
                                    {
                                        this.props.attachDisabled
                                            ? '' : (
                                            <div className="message-input__actions__item">
                                                <form>
                                                    <FileReaderInput as="url" multiple={true} onChange={this.props.handleChange}>
                                                        <Icon
                                                            name="attach"
                                                            width="10px"
                                                            height="20px"
                                                            iconClass="icon--clickable"
                                                        />
                                                    </FileReaderInput>
                                                </form>
                                            </div>
                                        )
                                    }
                                    <div className="message-input__actions__item">
                                        <Icon
                                            name="send"
                                            width="20px"
                                            height="16.8px"
                                            iconClass="icon--clickable"
                                            handleClick={this._handleIconClick.bind(this)}
                                        />
                                    </div>
                                </div>
                            )
                    }
                </div>
                <div className="message-input__email-actions">
                    <div className="message-input__email-actions__item message-input--middle">
                        <Icon
                            name="trash"
                            width="13px"
                            height="15px"
                            padding="10px 11px"
                            iconClass="icon--clickable icon--bordered-gray"
                            handleClick={this._handleIconClick.bind(this)}
                        />
                    </div>
                    <div className="message-input__email-actions__item">
                        <Button size="small" color="green-secondary" className="btn--large" handleOnClick={this.props.handleSendMessage}>
                            Enviar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

MessageInput.propTypes = {
    type: React.PropTypes.string,
    currentMessage: React.PropTypes.string,
    isEmailInput: React.PropTypes.bool,
    agentPhoto: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onChangeMessage: React.PropTypes.func,
    onInsertMessage: React.PropTypes.func,
    handleRespondClick: React.PropTypes.func,
    handleSendMessage: React.PropTypes.func,
    onDeleteClick: React.PropTypes.func,
    handleChange: React.PropTypes.func,
    attachDisabled: React.PropTypes.bool
};

MessageInput.defaultProps = {
    resize: 'no-resize'
};

export default MessageInput;
