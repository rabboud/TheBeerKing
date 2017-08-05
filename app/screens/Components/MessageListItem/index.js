import React from 'react';
import {Tag, Icon, Avatar} from 'app/screens/Components';
import Moment from 'moment';
import _ from 'lodash';

Moment.locale('pt-br');


class MessageListItem extends React.Component {
    constructor (props) {
        super(props);
    }

    _getIconType (type) {
        switch (type) {
            case 'telegram':
                return <Icon name="telegram" width="20px" height="20px" iconColor="default"/>;
            case 'facebook':
                return <Icon name="messenger" width="20px" height="20px" iconColor="default"/>;
            case 'email':
            case 'offcontact':
                return <Icon name="mail" width="20px" height="20px" iconColor="gray-primary"/>;
            case 'meli_qst':
            case 'meli_msg':
                return <Icon name="meli" width="22px" height="20px"/>;
            case 'audio':
                return <Icon name="voice" width="15px" height="20px" iconColor="gray-primary"/>;
            case 'video':
                return <Icon name="video" width="20px" height="20px" iconColor="gray-primary"/>;
            case 'phone':
                return <Icon name="phone" width="20px" height="20px" iconColor="gray-primary"/>;
            case 'NOTE':
                return <Avatar src={this.props.message.agent.photo || 'default'} size="small" fixedWidth={true}/>;
            case 'preview':
                return <Avatar src={'default'} size="small" fixedWidth={true}/>;
            default:
                return <Icon name="ballon-secondary" width="20px" iconColor="gray-primary"/>;
        }
    }

    _getTime (message) {
        let dateTime;

        if (message.messages) {
            if (message.messages.data.length) {
                dateTime = Moment(message.messages.data[0].time);
            }
        }

        if (message.startTime) {
            dateTime = Moment(message.startTime);
        }

        if (message.time) {
            dateTime = Moment(message.time);
        }

        if (dateTime) {
            return dateTime.fromNow();
        }

        return '...';
    }

    _getTitle (title, message) {
        switch (title) {
            case 'department':
                return `${message.department} - ${message.id}`;
            case 'agent':
                return message.agent.name;
            case 'preview':
                return ' ';
            default:
                return message.customerInfo.name;
        }
    }

    render () {
        return (
            <div className={`MessageListItem ${this.props.className}`} data-bkg-color={this.props.color} data-clickable={this.props.type !== 'note' && this.props.clickable} data-selected={this.props.isSelected} onClick={(event) => {if (this.props.handleItemClick) {this.props.handleItemClick(event, this.props.message.id);}}}>
                <header className="MessageListItem__header row">
                    <div className="MessageListItem__header__item MessageListItem__header__type large-1 columns">
                        {
                            this.props.message.type ? (
                                this._getIconType(this.props.message.type)
                            ) : (
                                <Avatar src={this.props.message.agent.photo || 'default'} size="small" fixedWidth={true}/>
                            )
                        }
                    </div>
                    {
                        this.props.message.type === 'NOTE' ? (
                            <div>
                                <div className="MessageListItem__header__item MessageListItem__header__title MessageListItem__header__title--note large-6 columns ryhtm--2 text--bold text--wrap">
                                    {this._getTitle(this.props.title, this.props.message) || 'Nome desconhecido'}
                                </div>
                                <div className="MessageListItem__header__item MessageListItem__header__time MessageListItem__header__time--note large-5 columns">
                                    <i className="MessageListItem__clock">
                                        <Icon name="clock" iconClass="icon--gray-secondary icon--inline" width="10px" height="10px"/>
                                    </i>
                                    {this._getTime(this.props.message)}
                                </div>
                            </div>
                        ) : (
                            <div>
                                {
                                    this.props.message.type !== 'preview' ? (
                                        <div>
                                            <div className="MessageListItem__header__item MessageListItem__header__title large-6 columns ryhtm--2 text--bold text--wrap">
                                                {this._getTitle(this.props.title, this.props.message) || 'Nome desconhecido'}
                                            </div>
                                            <div className="MessageListItem__header__item MessageListItem__header__time large-5 columns">
                                                <i className="MessageListItem__clock">
                                                    <Icon name="clock" iconClass="icon--gray-secondary icon--inline" width="10px" height="10px"/>
                                                </i>
                                                {this._getTime(this.props.message)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="MessageListItem__header__item MessageListItem__header__title large-8 columns ryhtm--2 text--bold text--wrap">
                                                <div className="MessageListItem__header__title--preview"></div>
                                            </div>
                                            <div className="MessageListItem__header__item MessageListItem__header__time large-2 columns">
                                                <i className="MessageListItem__clock">
                                                    <Icon name="clock" iconClass="icon--gray-secondary icon--inline" width="10px" height="10px"/>
                                                </i>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </header>
                <article className="MessageListItem__content row">
                    {
                        this.props.message.messages ? (
                            <div className="MessageListItem__content__item large-offset-1 large-11 columns">
                                <p>
                                    {
                                        this.props.message.messages.data.length ? (
                                            <span>
                                                {this.props.message.messages.data[this.props.message.messages.data.length - 1].content}
                                            </span>
                                        ) : ''
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className={`MessageListItem__content__item MessageListItem__content__item${this.props.message.type === 'NOTE' ? '--note' : '--preview'} large-offset-1 large-11 columns`}>
                                {
                                    this.props.message.content ? (
                                        <p>{this.props.message.content}</p>
                                    ) : (
                                        <div className="MessageListItem__content__item--preview">
                                            <p></p>
                                            <p></p>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </article>
                <footer className={`MessageListItem__footer row ${this.props.message.type === 'NOTE' ? 'MessageListItem__footer--note' : 'large-offset-1'}`}>
                    <div className="MessageListItem__footer__tags large-10 columns">
                        {this.props.message.tags.length > 0 ? _.map(this.props.message.tags, (tag, tkey) => (
                            <Tag title={tag.name || 'Tag'} color={tag.baseColor} key={tkey} />
                        )) : (
                            <Tag title={this.props.message.department} />
                        )}
                    </div>
                    {
                        this.props.message.type === 'NOTE' && this.props.editable ? (
                            <div className="MessageListItem__footer__edit large-2 columns">
                                <Icon
                                    name="pencil"
                                    inline={true}
                                    bkgCircle={true}
                                    width="13px"
                                    height="10px"
                                    padding="7px 8.5px"
                                    bkgColor="gray-primary"
                                    clickable={true}
                                    handleClick={this.props.handleEdit}
                                />
                            </div>
                        ) : ''
                    }
                </footer>
            </div>
        );
    }
}

MessageListItem.PropTypes = {
    className: React.PropTypes.string,
    messages: React.PropTypes.any,
    searchable: React.PropTypes.bool,
    handleItemClick: React.PropTypes.func,
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    itemColor: React.PropTypes.string,
    isSelected: React.PropTypes.bool,
    editable: React.PropTypes.bool,
    clickable: React.PropTypes.bool,
    handleEdit: React.PropTypes.func
};

export default MessageListItem;
