import React from 'react';
import Moment from 'moment';
import _ from 'lodash';
import Animated from '../Animated';
import MessageList from '../MessageList';
import Icon from '../Icon';
import Message from '../Message';

class InteractionHistory extends React.Component {
    constructor (props) {
        super(props);
    }

    _getIconType (type) {
        switch (type) {
            case 'telegram':
                return {type: 'telegram', width: '20px', color: 'gray-secondary'};
            case 'facebook':
                return {type: 'messenger', width: '20px', color: 'gray-secondary'};
            case 'audio':
                return {type: 'voice', width: '15px', color: 'gray-secondary'};
            case 'video':
                return {type: 'video', width: '20px', color: 'gray-secondary'};
            case 'email':
            case 'offcontact':
                return {type: 'mail', width: '20px', color: 'gray-secondary'};
            case 'phone':
                return {type: 'phone', width: '20px', color: 'gray-secondary'};
            case 'meli_msg':
            case 'meli_qst':
                return {type: 'meli', width: '22px'};
            default:
                return {type: 'ballon-secondary', width: '20px', color: 'gray-secondary'};
        }
    }

    render () {
        if (this.props.currentHistoryId) {
            this.currentHistory = _.find(this.props.history, {'id': this.props.currentHistoryId});
        }

        const historyDetail = (
            <div className="full--height">
                {
                    this.currentHistory ? (
                        <div className="InteractionHistory__detail">
                            <header className="InteractionHistory__detail__header rythm--6">
                                <div className="InteractionHistory__detail__header__action large-1 columns rythm--center"><Icon name="back" iconClass="icon--black icon--clickable" width="20px" height="13.8px" handleClick={this.props.closeHistoryDetail}/></div>
                                <div className="InteractionHistory__detail__header__type large-1 columns rythm--center"><Icon name={this._getIconType(this.currentHistory.type).type} iconColor={this._getIconType(this.currentHistory.type).color} width={this._getIconType(this.currentHistory.type).width} /></div>
                                <div className="InteractionHistory__detail__header__title large-6 columns ryhtm--2 rythm--center">{this.currentHistory.department} - {this.currentHistory.id}</div>
                                <div className="InteractionHistory__detail__header__time large-4 columns rythm--auto rythm--center"><i className="InteractionHistory__detail__clock"><Icon name="clock" iconClass="icon--gray-secondary icon--inline" width="10px" height="10px"/></i>{this.currentHistory.messages.length ? Moment(this.currentHistory.messages[0].time).fromNow() : Moment(this.currentHistory.startTime).fromNow()}</div>
                            </header>
                            <article className="InteractionHistory__detail__content">
                                <Message
                                    interaction={this.currentHistory}
                                    agentPhoto={this.props.agentPhoto}
                                    clientPhoto={this.props.clientPhoto}
                                />
                            </article>
                        </div>
                    ) : (
                        <div className="InteractionHistory__detail"></div>
                    )
                }
            </div>
        );

        return (
            <div className="InteractionHistory">
                <Animated
                    className="full--height"
                    transition={true}
                    secondariesPanel={[historyDetail]}
                    activePanelIndex={this.props.currentHistoryId ? 0 : -1}
                >
                    <div className="columns rythm--padding-t-2 rythm--padding-b-2 full--height">
                        {
                            _.isEmpty(this.props.history) ? (
                                <div className="rythm--padding-t-10">
                                    <div className="rythm--margin-b-2">
                                        <Icon name="interaction-history" width="126px" height="100px"/>
                                    </div>
                                    <h1 className="rythm--margin-b-1 title--tertiary title--gray centralize">
                                        Histórico de atendimento
                                    </h1>
                                    <p className="text--quaternary text--gray--quinquennary centralize">
                                         Esse cliente ainda não tem histórico.
                                    </p>
                                </div>
                            ) : (
                                <MessageList messages={this.props.history} searchable={false} handleLoadInteraction={this.props.viewHistoryDetail} title="department" handleTopList={this.props.loadMoreMessages}/>
                            )
                        }
                    </div>
                </Animated>
            </div>
        );
    }
}

InteractionHistory.PropTypes = {
    history: React.PropTypes.object,
    currentHistoryId: React.PropTypes.string,
    viewHistoryDetail: React.PropTypes.func,
    closeHistoryDetail: React.PropTypes.func,
    agentPhoto: React.PropTypes.string,
    clientPhoto: React.PropTypes.string,
    loadMoreMessages: React.PropTypes.func
};

export default InteractionHistory;
