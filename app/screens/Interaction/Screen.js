import React from 'react';
import _ from 'lodash';
import {browserHistory} from 'react-router';
import {interactionActions, currentUserActions} from 'app/flux/Actions';
import {
    Card,
    Message,
    MessageInput,
    Icon,
    EndInteraction,
    InteractionClient,
    Loader,
    Clock,
    InteractionHistory,
    InteractionNotes,
    InteractionTransfer,
    InteractionLocation,
    OMZHelmet,
    AttachamentModal
} from 'app/screens/Components';


class Component extends React.Component {
    constructor (props) {
        super(props);
        this.isTyping = false;
        this.checkTypingTimeout = '';
        this.sendEmptyTimeout = '';
        this.handleUpdateTransferFilter = this.handleUpdateTransferFilter.bind(this);
    }

    componentDidMount () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        if (!interaction) {
            this._closeScreen();
            return;
        }

        const accountId = this.props.currentUserStore.information.account.id;

        interactionActions.fetchInteraction(this._getSessionId());

        interactionActions.getTags(this._getSessionId(), accountId);
        interactionActions.getNotes(this._getSessionId());
        interactionActions.fetchCustomerHistory(this._getSessionId(), interaction.customerInfo.customerKey, this.props.viewsStore.accountFree);

        if (!this._isSocial()) {
            interactionActions.readMessages(this._getSessionId());
        }
        if (interaction.state === 'RINGING') {
            this._acceptInteraction();
        }
    }

    componentWillUnmount () {
        if (!this.props.interactionStore.interactions[this._getSessionId()]) {
            return;
        }

        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        if (interaction && interaction.state === 'TALKING') {
            if (interaction.type === 'video') {
                interactionActions.setVideoUrls(
                    this._getSessionId(),
                    this.refs.message.refs.localVideoStream.src,
                    this.refs.message.refs.remoteVideoStream.src
                );
            }

            if (interaction.type === 'audio') {
                interactionActions.setAudioUrl(
                    this._getSessionId(),
                    this.refs.message.refs.remoteAudioStream.src
                );
            }
        }
        interactionActions.fetchInteraction();
    }

    componentWillUpdate () {
        if (!this.props.interactionStore.interactions[this._getSessionId()]) {
            this._closeScreen();
            return;
        }
    }

    componentDidUpdate () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        if (!interaction) {
            this._closeScreen();
            return;
        }

        const sessionId = this.props.interactionStore.currentSessionId;

        if (sessionId !== this._getSessionId()) {
            const accountId = this.props.currentUserStore.information.account.id;

            interactionActions.fetchInteraction(this._getSessionId());
            interactionActions.fetchCustomerHistory(this._getSessionId(), this.props.interactionStore.interactions[this._getSessionId()].customerInfo.customerKey, this.props.viewsStore.accountFree);
            interactionActions.getTags(this._getSessionId(), accountId);
            interactionActions.getNotes(this._getSessionId());
            this._acceptInteraction();

            if (_.filter(interaction.messages.data, {'state': 'NOTREADED', 'direction': 'CLIENT'})) {
                interactionActions.readMessages(this._getSessionId());
            }
        }

        this._setMediaAudio(interaction.type);
    }

    _enableOffContactInput () {
        this.refs.messageInput.refs.messageInputMain.dataset.email = true;
    }

    _closeScreen () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        if (this.props.viewsStore.accountFree || (interaction && interaction.type === 'meli_msg')) {
            browserHistory.push('/inbox');
        } else {
            browserHistory.push('/');
        }
    }

    _getSessionId () {
        return this.props.defaultProps.location.search.split('?id=')[1];
    }

    _isSocial () {
        const type = this.props.interactionStore.interactions[this._getSessionId()].type;

        if (type === 'telegram' || type === 'facebook') {
            return true;
        }
        return false;
    }

    _setMediaAudio (type) {
        if (type === 'video') {
            this.refs.message.refs.localVideoStream.muted = true;
            this.refs.message.refs.localVideoStream.volume = 0;
            this.refs.message.refs.remoteVideoStream.muted = false;
            this.refs.message.refs.remoteVideoStream.volume = 1;
        }

        if (type === 'audio') {
            if (this.refs.message.refs.remoteAudioStream) {
                this.refs.message.refs.remoteAudioStream.muted = false;
                this.refs.message.refs.remoteAudioStream.volume = 1;
            }
        }
    }

    _acceptInteraction () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        if (interaction.state === 'RINGING') {
            if (interaction.type === 'video') {
                currentUserActions.setVideoElements(
                    this.refs.message.refs.localVideoStream,
                    this.refs.message.refs.remoteVideoStream
                );
                interactionActions.acceptCall(this._getSessionId());
            } else if (interaction.type === 'audio') {
                currentUserActions.setAudioElement(
                    this.refs.message.refs.remoteAudioStream
                );
                interactionActions.acceptCall(this._getSessionId());
            } else if (interaction.type === 'phone') {
                interactionActions.acceptCall(this._getSessionId());
            } else {
                if (interaction.customerInfo.externalHistory) {
                    interactionActions.loadRemoteMessages(this._getSessionId(), interaction.customerInfo.externalHistory);
                }
                if (this._isSocial() || interaction.isTransfer) {
                    interactionActions.retrieveMessages(this._getSessionId());
                } else {
                    interactionActions.connect(this._getSessionId());
                }
                this.props.currentUserStore.OmzSip.profile.acceptText(this._getSessionId());
            }
        } else if (interaction.state === 'TALKING') {
            if (interaction.type === 'video') {
                if (this.refs.message.refs.localVideoStream.paused) {
                    this.refs.message.refs.localVideoStream.src = interaction.localVideoUrl;
                    this.refs.message.refs.localVideoStream.play();
                }

                if (this.refs.message.refs.remoteVideoStream.paused) {
                    this.refs.message.refs.remoteVideoStream.src = interaction.remoteVideoUrl;
                    this.refs.message.refs.remoteVideoStream.play();
                }
            }

            if (interaction.type === 'audio') {
                if (this.refs.message.refs.remoteAudioStream.paused) {
                    this.refs.message.refs.remoteAudioStream.src = interaction.remoteAudioUrl;
                    this.refs.message.refs.remoteAudioStream.play();
                }
            }
        }

        if (interaction.state === 'TALKING' && interaction.type !== 'phone') {
            this.props.currentUserStore.OmzSip.profile.updateDataWidget(this._getSessionId(), '{\"customerKey\":\"' + interaction.customerInfo.customerKey + '\"}');
        }

        if (interaction.state === 'POSTPONED' && this._isSocial()) {
            interactionActions.retrieveMessages(this._getSessionId());
        }
    }

    _changeMessage (emoji) {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];
        const medias = ['offcontact', 'email', 'meli_qst'];
        let message;

        if (medias.includes(interaction.type)) {
            message = this.refs.messageInput.refs.messageInputTextEmail.value;
        } else {
            message = this.refs.messageInput.refs.messageInputText.value;
        }

        if (emoji.unicode) {
            const unicodeList = emoji.unicode.split('-');

            _.map(unicodeList, (unicode) => {
                message = message + String.fromCodePoint(`0x${unicode}`);
            });
            message = message + ' ';
        }

        interactionActions.saveCurrentMessage(this._getSessionId(), message);

        if (interaction.state !== 'TALKING') {
            return;
        }

        if (message) {
            if (!this.isTyping) {
                this.props.currentUserStore.OmzSip.profile.typed(this._getSessionId());
                this.isTyping = true;

                this.checkTypingTimeout = setTimeout(() => {
                    if (this.isTyping) {
                        this.isTyping = false;
                        this.sendEmptyTimeout = setTimeout(() => {
                            this.props.currentUserStore.OmzSip.profile.empty(this._getSessionId());
                        }, 5000);
                    }
                }, 5000);
            }
        } else {
            this.isTyping = false;
            this.props.currentUserStore.OmzSip.profile.empty(this._getSessionId());
        }
    }

    _addMessage (message) {
        const agentId = this.props.currentUserStore.information.id;

        if (this.props.interactionStore.interactions[this._getSessionId()].state === 'ENDED') {
            return;
        }

        if (this.props.interactionStore.interactions[this._getSessionId()].state === 'RECONNECTING') {
            return;
        }
        if (this.props.interactionStore.interactions[this._getSessionId()].type === 'meli_msg') {
            interactionActions.sendMeliMessage(message, this._getSessionId(), agentId);
            return;
        }
        interactionActions.sendMessage(message, this._getSessionId(), true);

        this.setState({
            startTyping: ''
        });
    }

    _showEndInteraction (type) {
        if (this.checkTypingTimeout) {
            clearTimeout(this.checkTypingTimeout);
        }

        interactionActions.showEndInteraction(this._getSessionId(), type);
    }

    _closeEndInteraction () {
        interactionActions.closeEndInteraction(this._getSessionId());
    }

    _saveCustomerInfo () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];
        const accountId = this.props.currentUserStore.information.account.id;
        const interactionHash = this._getSessionId();

        interaction.customerInfo.accountId = accountId;
        interaction.customerInfo.interactionHash = interactionHash;
        interactionActions.saveCustomerInfo(interaction.customerInfo, () => {
            const params = {
                interactionHash: interaction.id,
                interactionType: 'INTERACTION',
                accountId: this.props.currentUserStore.information.account.id,
                departmentId: interaction.departmentId,
                metaData: interaction.metaData
            };

            if (interaction.type === 'offcontact') {
                params.interactionType = 'OFFCONTACT';
            }
            if (!this.props.viewsStore.accountFree) {
                interactionActions.sendWebhook(params);
                interactionActions.sendRdstation(params);
            }
        });
    }

    _endInteraction (finish) {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];
        const data = interaction.customerInfo;
        const interactionType = interaction.type;
        const state = interaction.state;

        data.interactionHash = this._getSessionId();

        this._closeEndInteraction(); // Close end modal

        if (finish === true) {
            interactionActions.finishInteraction(this._getSessionId()); // Set state FINISHING
        } else {
            interactionActions.endInteraction(this._getSessionId()); // Set state ENDING
        }

        if (interactionType === 'offcontact') {
            return;
        }

        if (interactionType === 'audio' || interactionType === 'video') {
            this.props.currentUserStore.OmzSip.profile.finishCall();
            return;
        }

        if (interactionType === 'phone') {
            interaction.state = 'FINISH';
            this.props.currentUserStore.OmzSip.profile.finish(this._getSessionId());
            return;
        }

        if (state === 'RECONNECTING') {
            this.props.currentUserStore.OmzSip.profile.finishSession(this._getSessionId());
            this.props.interactionStore.interactions[this._getSessionId()].loading = '';
            this.props.interactionStore.interactions[this._getSessionId()].state = 'ENDED';
        } else {
            this.props.currentUserStore.OmzSip.profile.finishText(this._getSessionId());
        }
    }

    _finishInteraction () { // Green button Finish
        const medias = ['offcontact', 'meli_msg'];

        if (this._isSocial()) {
            if (this.props.interactionStore.interactions[this._getSessionId()].state === 'POSTPONED') {
                const target = this.props.interactionStore.interactions[this._getSessionId()].departmentUri;
                const agentId = this.props.currentUserStore.information.id;

                this._closeEndInteraction(); // Close end modal
                this._closeScreen(); // Close interaction screen
                interactionActions.closeSocial(this._getSessionId()); // Remove from interactions
                this.props.currentUserStore.OmzSip.profile.finishPostponed(this._getSessionId(), target, agentId);
                return;
            }
            this._endInteraction(true); // FinishText
            this._closeInteraction(); // FinishSession
            return;
        }

        if (!medias.includes(this.props.interactionStore.interactions[this._getSessionId()].type)) {
            this._endInteraction(true);
        }

        this._closeInteraction();
    }

    _finishSession () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        this._saveCustomerInfo();
        this._closeEndInteraction(); // Close end_modal
        if (interaction.type === 'meli_msg') {
            interactionActions.finishMeliMessage(this._getSessionId());
            this._closeScreen(); // Close interaction screen
            interactionActions.closeSocial(interaction.id); // Remove from interactions
            return;
        }
        if (interaction.state === 'POSTPONED') {
            const target = interaction.departmentUri;
            const agentId = this.props.currentUserStore.information.id;

            interactionActions.closeSocial(this._getSessionId()); // Remove from interactions
            this.props.currentUserStore.OmzSip.profile.finishPostponed(this._getSessionId(), target, agentId);
        }

        if (interaction.type === 'audio' || interaction.type === 'video') {
            if (interaction.state === 'RECONNECTING') {
                interactionActions.close(this._getSessionId());
            } else {
                interaction.state = 'FINISH';
                this.props.currentUserStore.OmzSip.profile.finishCall();
            }
        } if (interaction.type === 'phone') {
            interaction.state = 'FINISH';
            this.props.currentUserStore.OmzSip.profile.finish(this._getSessionId());
        } else {
            interaction.state = 'FINISH';
            this.props.currentUserStore.OmzSip.profile.finishText(this._getSessionId()); // FinishText SIP, set ENDED and FinishSession SIP
        }

        this._closeScreen(); // Close interaction screen
    }

    _endSession () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        this._closeEndInteraction(); // Close end_modal
        if (interaction.state === 'RECONNECTING') {
            interaction.state = 'ENDED';
        } else {
            interaction.state = 'END';
            if (interaction.type === 'audio' || interaction.type === 'video') {
                this.props.currentUserStore.OmzSip.profile.finishCall();
            } if (interaction.type === 'phone') {
                this.props.currentUserStore.OmzSip.profile.finish(this._getSessionId());
            } else {
                this.props.currentUserStore.OmzSip.profile.finishText(this._getSessionId()); // FinishText SIP, set ENDED and FinishSession SIP
            }
        }
    }

    _closeInteraction () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];
        const medias = ['offcontact', 'meli_msg'];

        if (!interaction) {
            return;
        }

        interactionActions.finishTransfer();

        if (!medias.includes(interaction.type)) {
            this._saveCustomerInfo();
            this._closeScreen(); // Close interaction screen
        } else {
            browserHistory.push('/inbox');
        }

        if (interaction.state === 'POSTPONEENDED') {
            interactionActions.closeSocial(this._getSessionId()); // Remove from interactions
        } else {
            interactionActions.close(interaction.id); // Remove from interactions
        }
    }

    _getInteractionTypeIcon () {
        switch (this.props.interactionStore.interactions[this._getSessionId()].type) {
            case 'text':
                return {'icon': 'balloon', width: '30px', height: '23.3px'};
            case 'video':
                return {'icon': 'video', width: '30px', height: '17.4px'};
            case 'audio':
                return {'icon': 'voice', width: '16px', height: '27px'};
            case 'facebook':
                return {'icon': 'messenger', width: '30px', height: '30px'};
            case 'telegram':
                return {'icon': 'telegram', width: '30px', height: '30px'};
            case 'email':
            case 'offcontact':
                return {'icon': 'mail', width: '28px', height: '17px'};
            case 'meli_qst':
            case 'meli_msg':
                return {'icon': 'meli', width: '32px', height: '23px'};
            case 'phone':
                return {'icon': 'phone', width: '25px', height: '25px'};
            default:
                return {'icon': 'balloon', width: '30px', height: '23.3px'};
        }
    }

    _changeClientMenu (name) {
        switch (name) {
            case 'user':
                interactionActions.changeClientMenu(this._getSessionId(), 0);
                break;
            case 'pencil':
                interactionActions.changeClientMenu(this._getSessionId(), 1);
                break;
            case 'history':
                interactionActions.changeClientMenu(this._getSessionId(), 2);
                break;
            case 'pin':
                interactionActions.changeClientMenu(this._getSessionId(), 3);
                break;
            default:
                interactionActions.changeClientMenu(this._getSessionId(), 0);
                break;
        }
    }
    _searchCustomers (e) {
        const name = this.refs.InteractionClient.searchField.state.value;

        if (name) {
            interactionActions.searchCustomerInfo(name, this._getSessionId(), this.props.currentUserStore.information.account.id);
        } else {
            interactionActions.clearCustomers(this._getSessionId());
        }
    }

    _clearSearchCustomers () {
        interactionActions.clearCustomers(this._getSessionId());
    }

    _changeCustomer (e, customerKey) {
        interactionActions.changeCustomer(this._getSessionId(), customerKey);
        interactionActions.fetchCustomerHistory(this._getSessionId(), customerKey, this.props.viewsStore.accountFree);
        this.props.currentUserStore.OmzSip.profile.updateDataWidget(this._getSessionId(), '{\"customerKey\":\"' + customerKey + '\"}');
    }

    _changeClientFormState (type) {
        interactionActions.setClientFormState(this._getSessionId(), type);
    }

    _saveClientForm () {
        const formData = {
            name: this.refs.InteractionClient.clientForm.form.components.name.state.value,
            email: this.refs.InteractionClient.clientForm.form.components.email.state.value,
            phone: this.refs.InteractionClient.clientForm.form.components.phone.state.value,
            cpf: this.refs.InteractionClient.clientForm.form.components.cpf.state.value
        };

        interactionActions.setClientFormValues(this._getSessionId(), formData);
    }

    _saveCustomer () {
        const customer = this.props.interactionStore.interactions[this._getSessionId()].clientForm;
        const accountId = this.props.currentUserStore.information.account.id;

        interactionActions.setCustomerInfoValues(this._getSessionId(), customer, accountId);
    }

    _viewHistoryInteraction (e, id) {
        interactionActions.fetchCustomerHistoryDetail(this._getSessionId(), id);
    }

    _closeHistoryInteraction () {
        interactionActions.fetchCustomerHistoryDetail(this._getSessionId(), '');
    }

    _loadHistoryMessages () {
        console.log('Load more messages!!!');
    }

    _createNote () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];
        const params = {
            sessionId: this._getSessionId(),
            agent: this.props.currentUserStore.information,
            department: interaction.department
        };

        if (interaction.notes.status === 'ERROR' || interaction.notes.status === 'TIMEOUT') {
            params.noteContent = interaction.currentNote.content;
            params.tags = interaction.currentNote.tags;
        } else {
            params.noteContent = this.refs.InteractionNotes.refs.AddNote.refs.NotesContent.refs.textArea.value;
            params.tags = this.refs.InteractionNotes.refs.AddNote.refs.Tags.state.selecteds;
        }

        params.tagIds = _.map(params.tags, (tag) => {
            return tag.id;
        });

        if (interaction.currentNote.id) {
            params.id = interaction.currentNote.id;
            interactionActions.updateNote(params);
        } else {
            interactionActions.createNote(params);
        }
    }

    _saveNote () {
        const params = {
            sessionId: this._getSessionId(),
            noteContent: this.refs.InteractionNotes.refs.AddNote.refs.NotesContent.refs.textArea.value,
            tags: this.refs.InteractionNotes.refs.AddNote.refs.Tags.state.selecteds,
            agent: this.props.currentUserStore.information,
            department: this.props.interactionStore.interactions[this._getSessionId()].department
        };

        interactionActions.saveNote(params);
    }

    _searchTagChange () {
        const searchValue = this.refs.InteractionNotes.refs.AddNote.refs.Tags.searchField.value;

        interactionActions.saveSearchTagValue(this._getSessionId(), searchValue);
    }

    _getClientMenuElements () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];
        const accountId = this.props.currentUserStore.information.account.id;

        switch (interaction.clientMenu) {
            case 1:
                return (
                    <InteractionNotes
                        ref="InteractionNotes"
                        notes={interaction.notes}
                        tags={interaction.tags}
                        interaction={interaction}
                        handleCreateNote={this._createNote.bind(this)}
                        handleNoteChange={this._saveNote.bind(this)}
                        handleToggleAddNote={() => interactionActions.toggleAddNote(this._getSessionId())}
                        handleToggleShowTags={() => interactionActions.toggleShowTags(this._getSessionId())}
                        handleChangeTags={(tags) => interactionActions.changeTags(this._getSessionId(), tags)}
                        handleSearchTagChange={this._searchTagChange.bind(this)}
                        handleLoadTags={() => interactionActions.getTags(this._getSessionId(), accountId)}
                        handleLoadNotes={() => interactionActions.getNotes(this._getSessionId())}
                        handleEditNote={(key) => interactionActions.editNote(this._getSessionId(), key)}
                    />
                );
            case 2:
                return (
                    <InteractionHistory
                        history={interaction.history}
                        viewHistoryDetail={this._viewHistoryInteraction.bind(this)}
                        currentHistoryId={interaction.currentHistoryId}
                        closeHistoryDetail={this._closeHistoryInteraction.bind(this)}
                        agentPhoto={'default'}
                        clientPhoto={'default'}
                        loadMoreMessages={this._loadHistoryMessages.bind(this)}
                    />
                );
            case 3:
                return (
                    <InteractionLocation
                        customer={interaction.customerInfo}
                    />
                );
            default:
                return (
                    <InteractionClient
                        ref="InteractionClient"
                        interaction={interaction}
                        handleSearchCustomer={this._searchCustomers.bind(this)}
                        handleChangeClient={this._changeCustomer.bind(this)}
                        handleSaveCustomer={this._saveCustomer.bind(this)}
                        handleChangeClientFormState={this._changeClientFormState.bind(this)}
                        handleClientFormChange={this._saveClientForm.bind(this)}
                        handleClearSearch={this._clearSearchCustomers.bind(this)}
                        handleViewHistory={() => this._changeClientMenu('history')}
                    />
                );
        }
    }

    _postponedInteraction () {
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];

        if (interaction.state === 'TALKING') {
            interaction.state = 'POSTPONED';
            this._closeEndInteraction(); // Close end modal
            this.props.currentUserStore.OmzSip.profile.postponeText(this._getSessionId());
        } else if (interaction.state === 'POSTPONED') {
            this._closeEndInteraction(); // Close end modal
            if (interaction.type === 'meli_msg') {
                this._closeScreen(); // Close interaction screen
                interactionActions.close(interaction.id); // Remove from interactions
                return;
            }
            interactionActions.closeSocial(this._getSessionId()); // Remove from interactions
        }
        this._closeScreen(); // Close interaction screen
    }

    _isPostponed () {
        switch (this.props.interactionStore.interactions[this._getSessionId()].type) {
            case 'facebook':
            case 'telegram':
            case 'meli_msg':
                return true;
            default:
                return false;
        }
    }

    _sendOffContactMessage () {
        const message = this.refs.messageInput.refs.messageInputTextEmail.value;

        if (message) {
            interactionActions.sendOffContactMessage(
                this._getSessionId(),
                this.props.currentUserStore.information,
                message,
                this.props.interactionStore.interactions[this._getSessionId()].customerInfo.email,
                this.props.interactionStore.interactions[this._getSessionId()].type
            );
        }
    }

    _handleChange (event, results) {
        const interactionType = this.props.interactionStore.interactions[this._getSessionId()].type;
        const agentId = this.props.currentUserStore.information.id;

        results.forEach((result) => {
            if (result[1].size > 15000000) {
                interactionActions.changeAttachmentAlert(this._getSessionId(), 'SIZE');
            } else {
                interactionActions.uploadFile(result[0].target.result, this._getSessionId(), result[1], interactionType, agentId);
            }
        });
    }

    _sendInteractionEmail (e) {
        e.preventDefault();
        interactionActions.sendChatContentViaEmail(
            this._getSessionId(),
            this.props.currentUserStore.information,
            this.props.interactionStore.interactions[this._getSessionId()].departmentId,
            this.refs.message.email.state.value.replace(/\s/g, '').replace(/,/g, ';').split(';')
        );
    }

    _inputDeleteClick () {
        const agentId = this.props.currentUserStore.information.id;

        interactionActions.discardOffcontact(this._getSessionId(), agentId);
        browserHistory.push('/inbox');
    }

    _getParent () {
        return document.querySelector('.main-wrapper__child');
    }

    handleTransferToggle (event) {
        if (this.props.interactionStore.interactions[this._getSessionId()].transferState === 'closed') {
            interactionActions.fetchTransferAgents();
        }
        interactionActions.toggleTransferState(this._getSessionId());
    }

    handleUpdateTransferFilter (component) {
        const filterValue = component.state.value;
        // const filterValue = context.agentName.value;

        if (this.props.interactionStore.transfer.filter !== filterValue) {
            interactionActions.updateTransferFilter({
                key: 'name',
                value: filterValue
            });
        }
    }

    handleTransfer (event, agentType, agentInformation) {
        const agentDestination = agentType === 'department' ? `${agentInformation.username}:` : `${agentInformation.department.username}:${agentInformation.username}`;

        interactionActions.transferInteraction(agentDestination);
    }

    handleTransferRetry (event, id) {
        interactionActions.retryTransferInteraction(id);
    }

    _canTransfer (interaction) {
        if (interaction.state === 'TALKING' && !this.props.viewsStore.accountFree) {
            return true;
        }
        return false;
    }

    render () {
        if (!this.props.interactionStore.interactions[this._getSessionId()]) {
            return (
                <div/>
            );
        }

        const clockOptions = {
            show: 'timer',
            countTime: this.props.interactionStore.currentSessionId !== this._getSessionId(),
            size: 'normal',
            background: true
        };

        const interactionIcon = this._getInteractionTypeIcon();
        const interaction = this.props.interactionStore.interactions[this._getSessionId()];
        const medias = ['offcontact', 'email', 'meli_qst'];

        const interactionMenuItens = [
            {
                component: <Icon name={interactionIcon.icon} width={interactionIcon.width} height={interactionIcon.height}/>
            },
            {
                component: (
                    <div className="interaction__info">
                        <p
                            className="interaction__info__client-name"
                            onClick={this._changeClientMenu.bind(this)}
                        >
                            {interaction.customerInfo.name || 'Nome desconhecido'}
                        </p>
                        <p className="interaction__info__department">
                            {interaction.department}
                        </p>
                    </div>
                )
            },
            {
                component: interaction.type === 'text' || interaction.type === 'video' || interaction.type === 'audio'
                    ? <Clock options={clockOptions} startTime={interaction.startTime} endTime={interaction.endTime} />
                    : ''
            },
            {
                component: this._canTransfer(interaction)
                    ? <Icon name="transfer" iconClass="icon--clickable icon--circle icon--bkg-opaque" width="20px" height="20px" padding="14px 10px 7px" handleClick={this.handleTransferToggle.bind(this)} />
                    : ''
            },
            {
                component: interaction.state === 'ENDED' || medias.includes(interaction.type) || interaction.state === 'POSTPONEENDED'
                    ? <Icon name="out" iconClass="icon--clickable icon--circle icon--bkg-green icon--pull-right-5" width="23.4px" height="20px" padding="10px 6px" handleClick={this._closeInteraction.bind(this)}/>
                    : <Icon name="close" iconClass="icon--clickable icon--circle icon--red" width="20px" height="20px" padding="10px" handleClick={() => this._showEndInteraction('ending')}/>
            }
        ];

        const clientMenuItens = [
            {
                status: interaction.clientMenu === 0 ? 'enabled' : 'disabled',
                component: <Icon name="user" iconClass="icon--clickable" textClass="icon-text--top-margin" width="20px" height="20px" iconText="Cliente" handleClick={this._changeClientMenu.bind(this)}/>
            },
            {
                status: interaction.clientMenu === 1 ? 'enabled' : 'disabled',
                component: <Icon name="pencil" iconClass="icon--clickable" textClass="icon-text--top-margin" width="17.7px" height="18px" iconText="Anotações" handleClick={this._changeClientMenu.bind(this)}/>
            },
            {
                status: interaction.clientMenu === 2 ? 'enabled' : 'disabled',
                component: <Icon name="history" iconClass="icon--clickable" alert={Object.keys(interaction.history).length} alertSize="big" alertColor="gray" conClass="icon--clickable" textClass="icon-text--top-margin" width="22.3px" height="20px" iconText="Histórico" handleClick={this._changeClientMenu.bind(this)}/>
            },
            {
                status: interaction.clientMenu === 3 ? 'enabled' : 'disabled',
                component: <Icon name="pin" iconClass="icon--clickable" textClass="icon-text--top-margin" width="15px" height="20px" iconText="Localização" handleClick={this._changeClientMenu.bind(this)}/>
            }
        ];

        return (
            <section className="interaction">
                <OMZHelmet title="Omnize - Em atendimento"/>
                {
                    interaction.loading === 'LOADING' || interaction.state === 'RINGING' ? (
                        <Loader className="Loader--content-full" backdrop={true}/>
                    ) : ''
                }
                <Card
                    helpers="card--full-height card--left card--header-padding interaction__interaction"
                    header={interactionMenuItens}
                >
                    <Message
                        interaction={interaction}
                        ref="message"
                        hasReducer={true}
                        agentPhoto={
                            this.props.currentUserStore.information.photo
                            ? this.props.currentUserStore.information.photo
                            : 'default'
                        }
                        clientPhoto={
                            interaction.clientPhoto
                            ? interaction.clientPhoto
                            : 'default'
                        }
                        sendInteractionEmail={this._sendInteractionEmail.bind(this)}
                    >
                        <MessageInput
                            ref="messageInput"
                            type={interaction.type}
                            currentMessage={interaction.currentMessage}
                            isEmailInput={medias.includes(interaction.type)}
                            agentPhoto={
                                this.props.currentUserStore.information.photo
                                ? this.props.currentUserStore.information.photo
                                : 'default'
                            }
                            disabled={interaction.state !== 'TALKING' && interaction.state !== 'POSTPONED' && !medias.includes(interaction.type)}
                            onChangeMessage={this._changeMessage.bind(this)}
                            onInsertMessage={this._addMessage.bind(this)}
                            handleSendMessage={this._sendOffContactMessage.bind(this)}
                            onDeleteClick={this._inputDeleteClick.bind(this)}
                            handleChange={this._handleChange.bind(this)}
                            attachDisabled={this.props.viewsStore.accountFree}
                        />
                    </Message>
                </Card>
                <Card
                    helpers="card--full-height card--right card__header--4-items"
                    header={clientMenuItens}
                >
                    {this._getClientMenuElements()}
                </Card>
                <EndInteraction
                    data={interaction.endInteraction}
                    onClose={this._closeEndInteraction.bind(this)}
                    handleEnd={this._endSession.bind(this)}
                    handleFinish={this._finishSession.bind(this)}
                    postponed={this._isPostponed()}
                    handlePostponed={this._postponedInteraction.bind(this)}
                    parentSelector={this._getParent.bind(this)}
                    handleClose={this._closeInteraction.bind(this)}
                />
                <InteractionTransfer
                    open={interaction.transferState}
                    status={this.props.interactionStore.transfer.status}
                    currentUser={this.props.currentUserStore.information}
                    agents={this.props.interactionStore.transfer.agents}
                    departments={this.props.interactionStore.transfer.departments}
                    handleUpdateFilter={this.handleUpdateTransferFilter}
                    updateFilterValue={this.props.interactionStore.transfer.filter}
                    handleRetry={this.handleTransferRetry}
                    handleTransfer={this.handleTransfer}
                    handleCloseModal={this.handleTransferToggle.bind(this)}
                    handleFinishInteraction={this._closeInteraction.bind(this)}
                    parentSelector={this._getParent.bind(this)}
                />
                <AttachamentModal
                    isOpen={interaction.attachmentAlert !== ''}
                    handleCloseModal={() => interactionActions.changeAttachmentAlert(this._getSessionId(), '')}
                    parentSelector={this._getParent.bind(this)}
                    showOwl={this.props.currentUserStore.information.licenseCode !== 'PARTNER'}
                />
            </section>
        );
    }
}

export default Component;
